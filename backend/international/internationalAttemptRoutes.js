const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const InternationalExam = require("./InternationalExam");
const InternationalQuestion = require("./InternationalQuestion");
const InternationalPurchase = require("./InternationalPurchase");
const InternationalAttempt = require("./InternationalAttempt");
const InternationalScoreReport = require("./InternationalScoreReport");

const ACTIVE_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "PAUSED"];

function getUserId(req) {
  return req.user?.id || req.user?._id || req.user?.userId || null;
}

function publicQuestion(question) {
  return {
    _id: question._id,
    examCode: question.examCode,
    moduleCode: question.moduleCode,
    sectionCode: question.sectionCode,
    questionType: question.questionType,
    question: question.question,
    instructions: question.instructions || "",
    passage: question.passage || "",
    audioUrl: question.audioUrl || "",
    imageUrl: question.imageUrl || "",
    options: question.options || [],
    difficulty: question.difficulty,
    marks: question.marks,
    negativeMarks: question.negativeMarks,
    questionNumber: question.questionNumber,
  };
}

function sameAnswer(left, right) {
  const normalize = (value) => {
    if (typeof value === "string") {
      return value.trim().toLowerCase();
    }

    if (Array.isArray(value)) {
      return value
        .map(normalize)
        .sort((a, b) =>
          JSON.stringify(a).localeCompare(JSON.stringify(b))
        );
    }

    if (value && typeof value === "object") {
      return Object.keys(value)
        .sort()
        .reduce((out, key) => {
          out[key] = normalize(value[key]);
          return out;
        }, {});
    }

    return value;
  };

  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined
  ) {
    return false;
  }

  if (typeof left === "number" || typeof right === "number") {
    const a = Number(left);
    const b = Number(right);

    if (Number.isFinite(a) && Number.isFinite(b)) {
      return a === b;
    }
  }

  return (
    JSON.stringify(normalize(left)) ===
    JSON.stringify(normalize(right))
  );
}

function getSection(attempt, sectionCode) {
  return attempt.sections.find(
    (section) => section.sectionCode === sectionCode
  );
}

function sectionDeadline(section) {
  if (!section?.startedAt || !Number(section.duration)) {
    return null;
  }

  return new Date(
    new Date(section.startedAt).getTime() +
      Number(section.duration) * 60 * 1000
  );
}

function totalDurationMinutes(sections) {
  return sections.reduce(
    (total, section) =>
      total + Math.max(0, Number(section.duration) || 0),
    0
  );
}

async function findValidPurchase(userId, examCode) {
  const now = new Date();

  return InternationalPurchase.findOne({
    userId,
    status: "success",
    examCodes: examCode,
    accessStartsAt: { $lte: now },
    accessExpiresAt: { $gt: now },
  }).sort({ accessExpiresAt: -1 });
}

function attemptSummary(attempt) {
  return {
    _id: attempt._id,
    examCode: attempt.examCode,
    moduleCode: attempt.moduleCode,
    status: attempt.status,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    submittedAt: attempt.submittedAt,

    sections: attempt.sections.map((section) => ({
      sectionCode: section.sectionCode,
      sectionName: section.sectionName,
      startedAt: section.startedAt,
      completedAt: section.completedAt,
      duration: section.duration,
      questionCount: section.questionCount,
      status: section.status,
    })),

    scoring: attempt.scoring,
  };
}

/*
==========================================================
1. START OR RESUME AN INTERNATIONAL EXAMINATION

POST /api/international/attempts/start

Body:
{
  "examCode": "GMAT",
  "moduleCode": "MODULE_CODE"
}
==========================================================
*/

router.post("/attempts/start", authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const examCode = String(
      req.body?.examCode || ""
    )
      .trim()
      .toUpperCase();

    const moduleCode = String(
      req.body?.moduleCode || ""
    )
      .trim()
      .toUpperCase();

    if (!examCode || !moduleCode) {
      return res.status(400).json({
        success: false,
        message: "Exam code and module code are required.",
      });
    }

    // ======================================================
    // INTERNATIONAL CBT ACCESS
    // Local testing bypass is permitted only when BOTH
    // development environment flags are explicitly enabled.
    // Authentication is still required.
    // Production continues to require a valid purchase.
    // ======================================================

   
const localInternationalAccess =
  process.env.NODE_ENV === "development" &&
  process.env.INTERNATIONAL_CBT_DEV_ACCESS === "true";

let purchase = null;

if (!localInternationalAccess) {
  purchase = await findValidPurchase(userId, examCode);

  if (!purchase) {
    return res.status(403).json({
      success: false,
      message:
        "You do not have valid access to this examination.",
    });
  }
}


    if (!purchase) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have valid access to this examination.",
      });
    }

    const exam = await InternationalExam.findOne({
      code: examCode,
      active: true,
    }).lean();

    if (!exam) {
      return res.status(404).json({
        success: false,
        message:
          "The requested examination was not found or is inactive.",
      });
    }

    const module = (exam.modules || []).find(
      (item) =>
        item.code === moduleCode &&
        item.active !== false
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message:
          "The requested examination module was not found or is inactive.",
      });
    }

    const existing = await InternationalAttempt.findOne({
      user: userId,
      examCode,
      moduleCode,
      status: { $in: ACTIVE_STATUSES },
    }).sort({ createdAt: -1 });

    if (
      existing &&
      (!existing.expiresAt ||
        existing.expiresAt > new Date())
    ) {
      return res.status(200).json({
        success: true,
        resumed: true,
        attempt: attemptSummary(existing),
      });
    }

    const activeSections = (
      module.sections || []
    ).filter((section) => section.active !== false);

    if (!activeSections.length) {
      return res.status(422).json({
        success: false,
        message:
          "This module has no active sections configured.",
      });
    }

    const sectionRecords = [];
    const questionIdsBySection = {};

    for (const section of activeSections) {
      const questions = await InternationalQuestion.find({
        examCode,
        moduleCode,
        sectionCode: section.code,
        active: true,
      })
        .sort({ questionNumber: 1, _id: 1 })
        .select("_id marks")
        .lean();

      if (!questions.length) {
        return res.status(422).json({
          success: false,
          message:
            `Section ${section.code} has no active questions. ` +
            "The examination cannot start yet.",
          sectionCode: section.code,
        });
      }

      questionIdsBySection[section.code] =
        questions.map((question) =>
          String(question._id)
        );

      sectionRecords.push({
        sectionCode: section.code,
        sectionName: section.name,
        startedAt: null,
        completedAt: null,
        duration: Number(section.duration) || 0,
        questionCount: questions.length,
        status: "NOT_STARTED",
        score: 0,

        maximumScore: questions.reduce(
          (sum, question) =>
            sum +
            Math.max(0, Number(question.marks) || 0),
          0
        ),

        percentage: 0,
      });
    }

    const now = new Date();
    const duration = totalDurationMinutes(
      sectionRecords
    );

    const firstSection = sectionRecords[0];

    firstSection.startedAt = now;
    firstSection.status = "IN_PROGRESS";

    const questionIds = Object.values(
      questionIdsBySection
    ).flat();

    const answers = questionIds.map(
      (questionId) => ({
        questionId:
          new mongoose.Types.ObjectId(questionId),
        answer: null,
        isAnswered: false,
        isCorrect: false,
        marksAwarded: 0,
        submittedAt: null,
      })
    );

    const attempt = await InternationalAttempt.create({
      user: userId,
      examCode,
      moduleCode,
      attemptNumber: 1,
      sections: sectionRecords,
      answers,

      scoring: {
        score: 0,

        maximumScore: sectionRecords.reduce(
          (sum, section) =>
            sum + section.maximumScore,
          0
        ),

        percentage: 0,
        band: null,
        grade: null,
        scoreType: exam.scoring?.type || "RAW",
      },

      status: "IN_PROGRESS",
      startedAt: now,

      expiresAt:
        duration > 0
          ? new Date(
              now.getTime() +
                duration * 60 * 1000
            )
          : null,

      totalDuration: duration,
      paymentReference: purchase.reference,

      attemptMetadata: {
        examName: exam.name,
        moduleName: module.name,
        questionIdsBySection,
        currentSectionCode:
          firstSection.sectionCode,
      },
    });

    return res.status(201).json({
      success: true,
      resumed: false,
      attempt: attemptSummary(attempt),
    });
  } catch (error) {
    console.error(
      "Error starting International examination attempt:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to start the examination.",
    });
  }
});

/*
==========================================================
2. LOAD A SECTION AND ITS QUESTIONS

GET /api/international/attempts/:attemptId/section/:sectionCode

Correct answers are not returned to the candidate.
==========================================================
*/

router.get(
  "/attempts/:attemptId/section/:sectionCode",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (
        !mongoose.isValidObjectId(
          req.params.attemptId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid attempt ID.",
        });
      }

      const attempt =
        await InternationalAttempt.findOne({
          _id: req.params.attemptId,
          user: userId,
        });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: "Examination attempt not found.",
        });
      }

      if (
        !["IN_PROGRESS", "PAUSED"].includes(
          attempt.status
        )
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This examination attempt is no longer active.",
        });
      }

      if (
        attempt.expiresAt &&
        attempt.expiresAt <= new Date()
      ) {
        attempt.status = "EXPIRED";
        await attempt.save();

        return res.status(410).json({
          success: false,
          message:
            "The examination time has expired. Submit the attempt to calculate the result.",
        });
      }

      const sectionCode = String(
        req.params.sectionCode || ""
      )
        .trim()
        .toUpperCase();

      const section = getSection(
        attempt,
        sectionCode
      );

      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Section not found in this attempt.",
        });
      }

      const currentSectionCode =
        attempt.attemptMetadata?.currentSectionCode;

      if (
        currentSectionCode &&
        currentSectionCode !== sectionCode
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Complete the current section before opening another section.",
          currentSectionCode,
        });
      }

      if (
        section.status === "COMPLETED" ||
        section.status === "EXPIRED"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This section has already ended.",
        });
      }

      if (!section.startedAt) {
        const previousIndex =
          attempt.sections.findIndex(
            (item) =>
              item.sectionCode === sectionCode
          ) - 1;

        if (
          previousIndex >= 0 &&
          !["COMPLETED", "EXPIRED"].includes(
            attempt.sections[previousIndex].status
          )
        ) {
          return res.status(409).json({
            success: false,
            message:
              "Complete the previous section first.",
          });
        }

        section.startedAt = new Date();
        section.status = "IN_PROGRESS";

        attempt.attemptMetadata = {
          ...(
            attempt.attemptMetadata?.toObject?.() ||
            attempt.attemptMetadata ||
            {}
          ),

          currentSectionCode: sectionCode,
        };

        await attempt.save();
      }

      const deadline = sectionDeadline(section);

      if (deadline && deadline <= new Date()) {
        section.status = "EXPIRED";
        section.completedAt = new Date();

        await attempt.save();

        return res.status(410).json({
          success: false,
          message:
            "This section's time has expired.",
        });
      }

      const ids =
        attempt.attemptMetadata
          ?.questionIdsBySection?.[sectionCode] || [];

      const questions =
        await InternationalQuestion.find({
          _id: { $in: ids },
          active: true,
        })
          .sort({ questionNumber: 1, _id: 1 })
          .lean();

      const answerById = new Map(
        attempt.answers.map((item) => [
          String(item.questionId),
          item,
        ])
      );

      return res.json({
        success: true,
        attempt: attemptSummary(attempt),

        section: {
          sectionCode: section.sectionCode,
          sectionName: section.sectionName,
          duration: section.duration,
          startedAt: section.startedAt,
          deadline,
          questionCount: questions.length,
        },

        questions: questions.map(
          (question) => ({
            ...publicQuestion(question),

            candidateAnswer:
              answerById.get(
                String(question._id)
              )?.answer ?? null,
          })
        ),
      });
    } catch (error) {
      console.error(
        "Error loading International attempt section:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load this examination section.",
      });
    }
  }
);

/*
==========================================================
3. SAVE A CANDIDATE ANSWER

PUT /api/international/attempts/:attemptId/answers

Body:
{
  "questionId": "QUESTION_OBJECT_ID",
  "answer": "C"
}
==========================================================
*/

router.put(
  "/attempts/:attemptId/answers",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (
        !mongoose.isValidObjectId(
          req.params.attemptId
        ) ||
        !mongoose.isValidObjectId(
          req.body?.questionId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "A valid attempt ID and question ID are required.",
        });
      }

      const attempt =
        await InternationalAttempt.findOne({
          _id: req.params.attemptId,
          user: userId,
        });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: "Examination attempt not found.",
        });
      }

      if (attempt.status !== "IN_PROGRESS") {
        return res.status(409).json({
          success: false,
          message:
            "This attempt is not accepting answers.",
        });
      }

      if (
        attempt.expiresAt &&
        attempt.expiresAt <= new Date()
      ) {
        attempt.status = "EXPIRED";
        await attempt.save();

        return res.status(410).json({
          success: false,
          message:
            "The examination time has expired.",
        });
      }

      const questionId = String(
        req.body.questionId
      );

      const answerRecord =
        attempt.answers.find(
          (item) =>
            String(item.questionId) ===
            questionId
        );

      if (!answerRecord) {
        return res.status(403).json({
          success: false,
          message:
            "This question does not belong to the attempt.",
        });
      }

      const question =
        await InternationalQuestion.findById(
          questionId
        )
          .select(
            "examCode moduleCode sectionCode active"
          )
          .lean();

      if (
        !question ||
        !question.active ||
        question.examCode !== attempt.examCode ||
        question.moduleCode !== attempt.moduleCode
      ) {
        return res.status(403).json({
          success: false,
          message:
            "This question is not available for this attempt.",
        });
      }

      const section = getSection(
        attempt,
        question.sectionCode
      );

      if (
        !section ||
        section.status !== "IN_PROGRESS"
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This section is not currently accepting answers.",
        });
      }

      const deadline = sectionDeadline(section);

      if (deadline && deadline <= new Date()) {
        section.status = "EXPIRED";
        section.completedAt = new Date();

        await attempt.save();

        return res.status(410).json({
          success: false,
          message:
            "This section's time has expired.",
        });
      }

      answerRecord.answer =
        req.body.answer ?? null;

      answerRecord.isAnswered =
        req.body.answer !== null &&
        req.body.answer !== undefined &&
        req.body.answer !== "";

      answerRecord.submittedAt = new Date();

      await attempt.save();

      return res.json({
        success: true,
        message: "Answer saved.",
        questionId,
        isAnswered: answerRecord.isAnswered,
      });
    } catch (error) {
      console.error(
        "Error saving International examination answer:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Unable to save the answer.",
      });
    }
  }
);

/*
==========================================================
4. COMPLETE A SECTION AND ADVANCE

POST /api/international/attempts/:attemptId/sections/:sectionCode/complete
==========================================================
*/

router.post(
  "/attempts/:attemptId/sections/:sectionCode/complete",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (
        !mongoose.isValidObjectId(
          req.params.attemptId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid attempt ID.",
        });
      }

      const attempt =
        await InternationalAttempt.findOne({
          _id: req.params.attemptId,
          user: userId,
        });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: "Examination attempt not found.",
        });
      }

      if (attempt.status !== "IN_PROGRESS") {
        return res.status(409).json({
          success: false,
          message: "This attempt is not active.",
        });
      }

      const sectionCode = String(
        req.params.sectionCode || ""
      )
        .trim()
        .toUpperCase();

      const index = attempt.sections.findIndex(
        (item) =>
          item.sectionCode === sectionCode
      );

      if (index < 0) {
        return res.status(404).json({
          success: false,
          message: "Section not found.",
        });
      }

      const section = attempt.sections[index];

      if (section.status !== "IN_PROGRESS") {
        return res.status(409).json({
          success: false,
          message:
            "This section is not in progress.",
        });
      }

      section.completedAt = new Date();

      section.status =
        sectionDeadline(section) &&
        sectionDeadline(section) <= new Date()
          ? "EXPIRED"
          : "COMPLETED";

      const nextSection =
        attempt.sections[index + 1];

      if (nextSection) {
        nextSection.startedAt = new Date();
        nextSection.status = "IN_PROGRESS";

        attempt.attemptMetadata = {
          ...(
            attempt.attemptMetadata?.toObject?.() ||
            attempt.attemptMetadata ||
            {}
          ),

          currentSectionCode:
            nextSection.sectionCode,
        };
      } else {
        attempt.attemptMetadata = {
          ...(
            attempt.attemptMetadata?.toObject?.() ||
            attempt.attemptMetadata ||
            {}
          ),

          currentSectionCode: null,
          allSectionsCompleted: true,
        };
      }

      await attempt.save();

      return res.json({
        success: true,
        attempt: attemptSummary(attempt),
        nextSectionCode:
          nextSection?.sectionCode || null,
        allSectionsCompleted: !nextSection,
      });
    } catch (error) {
      console.error(
        "Error completing International examination section:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to complete this section.",
      });
    }
  }
);

/*
==========================================================
5. SUBMIT EXAMINATION AND CALCULATE RESULT

POST /api/international/attempts/:attemptId/submit
==========================================================
*/

router.post(
  "/attempts/:attemptId/submit",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (
        !mongoose.isValidObjectId(
          req.params.attemptId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid attempt ID.",
        });
      }

      const attempt =
        await InternationalAttempt.findOne({
          _id: req.params.attemptId,
          user: userId,
        });

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: "Examination attempt not found.",
        });
      }

      if (
        ["SUBMITTED", "COMPLETED"].includes(
          attempt.status
        ) &&
        attempt.scoreReportId
      ) {
        const savedReport =
          await InternationalScoreReport.findById(
            attempt.scoreReportId
          ).lean();

        return res.json({
          success: true,
          alreadySubmitted: true,
          attempt: attemptSummary(attempt),
          result: savedReport,
        });
      }

      if (
        ![
          "IN_PROGRESS",
          "EXPIRED",
          "PAUSED",
        ].includes(attempt.status)
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This attempt cannot be submitted in its current state.",
        });
      }

      const questionIds = attempt.answers.map(
        (item) => item.questionId
      );

      const questions =
        await InternationalQuestion.find({
          _id: { $in: questionIds },
        }).lean();

      const questionMap = new Map(
        questions.map((question) => [
          String(question._id),
          question,
        ])
      );

      let totalScore = 0;
      let maximumScore = 0;

      const manualQuestionIds = [];

      for (const answerRecord of attempt.answers) {
        const question = questionMap.get(
          String(answerRecord.questionId)
        );

        if (!question) continue;

        const marks = Math.max(
          0,
          Number(question.marks) || 0
        );

        maximumScore += marks;

        answerRecord.isCorrect = false;
        answerRecord.marksAwarded = 0;

        if (!answerRecord.isAnswered) continue;

        if (
          ["MANUAL", "RUBRIC", "BAND"].includes(
            question.scoringType
          ) ||
          question.questionType === "ESSAY"
        ) {
          manualQuestionIds.push(
            String(question._id)
          );

          continue;
        }

        let correct = sameAnswer(
          answerRecord.answer,
          question.answer
        );

        if (
          question.questionType ===
            "NUMERICAL_ENTRY" &&
          question.answerConfiguration &&
          question.answerConfiguration.value !==
            undefined
        ) {
          const submitted = Number(
            answerRecord.answer
          );

          const expected = Number(
            question.answerConfiguration.value
          );

          const tolerance = Math.max(
            0,
            Number(
              question.answerConfiguration.tolerance
            ) || 0
          );

          correct =
            Number.isFinite(submitted) &&
            Number.isFinite(expected) &&
            Math.abs(submitted - expected) <=
              tolerance;
        }

        if (correct) {
          answerRecord.isCorrect = true;
          answerRecord.marksAwarded = marks;
          totalScore += marks;
        } else {
          const penalty = Math.max(
            0,
            Number(question.negativeMarks) || 0
          );

          answerRecord.marksAwarded = -penalty;
          totalScore -= penalty;
        }
      }

      const percentage =
        maximumScore > 0
          ? Math.max(
              0,
              (totalScore / maximumScore) * 100
            )
          : 0;

      const exam =
        await InternationalExam.findOne({
          code: attempt.examCode,
        }).lean();

      const passingScore = Number(
        exam?.scoring?.passingScore
      );

      const hasPassingScore =
        Number.isFinite(passingScore);

      const resultStatus =
        manualQuestionIds.length
          ? "PENDING"
          : hasPassingScore
            ? percentage >= passingScore
              ? "PASS"
              : "FAIL"
            : "COMPLETED";

      for (const section of attempt.sections) {
        const sectionIds = new Set(
          (
            attempt.attemptMetadata
              ?.questionIdsBySection?.[
              section.sectionCode
            ] || []
          ).map(String)
        );

        const sectionQuestions = questions.filter(
          (question) =>
            sectionIds.has(String(question._id))
        );

        const sectionAnswers =
          attempt.answers.filter((answer) =>
            sectionIds.has(
              String(answer.questionId)
            )
          );

        section.maximumScore =
          sectionQuestions.reduce(
            (sum, question) =>
              sum +
              Math.max(
                0,
                Number(question.marks) || 0
              ),
            0
          );

        section.score = sectionAnswers.reduce(
          (sum, answer) =>
            sum +
            (Number(answer.marksAwarded) || 0),
          0
        );

        section.percentage =
          section.maximumScore > 0
            ? Math.max(
                0,
                (section.score /
                  section.maximumScore) *
                  100
              )
            : 0;

        if (
          !["COMPLETED", "EXPIRED"].includes(
            section.status
          )
        ) {
          section.status = "COMPLETED";
          section.completedAt = new Date();
        }
      }

      const reportNumber =
        `ISR-${Date.now()}-` +
        crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase();

      const report =
        await InternationalScoreReport.create({
          user: userId,
          attempt: attempt._id,
          examCode: attempt.examCode,
          moduleCode: attempt.moduleCode,

          examName:
            exam?.name ||
            attempt.attemptMetadata?.examName ||
            attempt.examCode,

          moduleName:
            attempt.attemptMetadata?.moduleName ||
            attempt.moduleCode,

          sections: attempt.sections.map(
            (section) => ({
              sectionCode: section.sectionCode,
              sectionName: section.sectionName,
              score: section.score,
              maximumScore:
                section.maximumScore,
              percentage: section.percentage,
              band: null,
              grade: null,

              status: manualQuestionIds.length
                ? "PENDING"
                : section.status,

              scoreType:
                exam?.scoring?.type || "RAW",
            })
          ),

          overallScore: totalScore,
          maximumScore,
          percentage,
          band: null,
          grade: null,
          scoreType: exam?.scoring?.type || "RAW",
          resultStatus,
          reportNumber,
          issuedAt: new Date(),

          certificateEligible:
            !manualQuestionIds.length &&
            resultStatus === "PASS",

          certificateIssued: false,

          metadata: {
            manualReviewQuestionIds:
              manualQuestionIds,
          },
        });

      attempt.scoring = {
        score: totalScore,
        maximumScore,
        percentage,
        band: null,
        grade: null,
        scoreType: exam?.scoring?.type || "RAW",
      };

      attempt.status = manualQuestionIds.length
        ? "SUBMITTED"
        : "COMPLETED";

      attempt.submittedAt = new Date();
      attempt.completedAt = new Date();
      attempt.scoreReportIssued = true;
      attempt.scoreReportId = report._id;

      await attempt.save();

      return res.json({
        success: true,
        attempt: attemptSummary(attempt),
        result: report,

        manualReviewRequired:
          manualQuestionIds.length > 0,

        manualReviewQuestionCount:
          manualQuestionIds.length,
      });
    } catch (error) {
      console.error(
        "Error submitting International examination attempt:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to submit the examination.",
      });
    }
  }
);

/*
==========================================================
6. RETRIEVE A SAVED RESULT

GET /api/international/attempts/:attemptId/result
==========================================================
*/

router.get(
  "/attempts/:attemptId/result",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      if (
        !mongoose.isValidObjectId(
          req.params.attemptId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid attempt ID.",
        });
      }

      const attempt =
        await InternationalAttempt.findOne({
          _id: req.params.attemptId,
          user: userId,
        }).lean();

      if (!attempt) {
        return res.status(404).json({
          success: false,
          message: "Examination attempt not found.",
        });
      }

      if (!attempt.scoreReportId) {
        return res.status(409).json({
          success: false,
          message:
            "The result is not available yet.",
        });
      }

      const report =
        await InternationalScoreReport.findById(
          attempt.scoreReportId
        ).lean();

      if (!report) {
        return res.status(404).json({
          success: false,
          message:
            "The score report was not found.",
        });
      }

      return res.json({
        success: true,
        attempt: attemptSummary(attempt),
        result: report,
      });
    } catch (error) {
      console.error(
        "Error loading International examination result:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load the examination result.",
      });
    }
  }
);

module.exports = router;