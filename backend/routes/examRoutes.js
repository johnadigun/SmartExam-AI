
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Question = require("../models/question");
const Exam = require("../models/exam");
const buildCategoryExam = require("../utils/categoryExamBuilder");

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");
const cbtGuard = require("../middleware/cbtGuard");

/* =========================================================
   CATEGORY EXAM BUILDER
   ========================================================= */

router.get(
  "/category/:category",
  authMiddleware,
  async (req, res) => {
    console.log(
      "CATEGORY ROUTE HIT:",
      req.params.category
    );

    try {
      const category = req.params.category;

      const mode =
        (req.query.mode || "practice").toLowerCase();

      const exam =
        await buildCategoryExam(
          category,
          mode
        );

      return res.json({
        success: true,
        exam,
      });
    } catch (err) {
      console.error(
        "CATEGORY EXAM ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);


/* =========================================================
   RANDOM PRACTICE MODE
   ENTIRE QUESTION BANK
   NO CATEGORY REQUIRED
   ========================================================= */

router.get(
  "/practice",
  authMiddleware,
  async (req, res) => {
    try {
      console.log(
        "================================"
      );

      console.log(
        "RANDOM PRACTICE MODE"
      );

      console.log(
        "Loading entire question bank..."
      );

      let questions =
        await Question.find({}).lean();

      console.log(
        "TOTAL QUESTIONS FOUND:",
        questions.length
      );

      if (!questions.length) {
        return res.status(404).json({
          success: false,
          message:
            "No questions found in the question bank.",
        });
      }

      /* -------------------------
         RANDOMIZE ENTIRE BANK
         ------------------------- */

      questions =
        questions.sort(
          () => Math.random() - 0.5
        );

      /* -------------------------
         SELECT 50 QUESTIONS
         ------------------------- */

      questions =
        questions.slice(
          0,
          50
        );

      console.log(
        "FINAL PRACTICE QUESTIONS:",
        questions.length
      );

      console.log(
        "================================"
      );

      return res.json({
        success: true,

        exam: {
          title:
            "SmartExam Practice Test",

          duration: 30,

          questions,
        },
      });
    } catch (err) {
      console.error(
        "RANDOM PRACTICE ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message ||
          "Unable to load Practice questions.",
      });
    }
  }
);


/* =========================================================
   SUBJECT CBT MODE
   ========================================================= */

router.get(
  "/subject/:subject",
  authMiddleware,
  cbtGuard,
  async (req, res) => {
    try {
      let subject =
        req.params.subject;

      const mode =
        (req.query.mode || "practice").toLowerCase();

      if (subject === "English Language") {
        subject = "English";

        console.log(
          "***** ENGLISH CONVERSION WORKED *****"
        );
      }

      if (subject === "Financial Accounting") {
        subject = "Accounting";
      }

      console.log(
        "--------------------------------"
      );

      console.log(
        "SUBJECT CBT"
      );

      console.log(
        "Subject:",
        subject
      );

      console.log(
        "Mode:",
        mode
      );

      let questions =
        await Question.find({
          subject,
        });

      console.log(
        "Questions Found:",
        questions.length
      );

      if (!questions.length) {
        return res.status(404).json({
          success: false,
          message:
            `No questions found for ${subject}`,
        });
      }

      questions =
        questions.sort(
          () => Math.random() - 0.5
        );

      const limit =
        mode === "cbt"
          ? 100
          : 50;

      questions =
        questions.slice(
          0,
          limit
        );

      return res.json({
        success: true,

        exam: {
          title:
            `${subject} CBT Examination`,

          subject,

          duration:
            mode === "cbt"
              ? 120
              : 30,

          questions,
        },
      });
    } catch (err) {
      console.error(
        "SUBJECT EXAM ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);


/* =========================================================
   CREATE EXAM
   ADMINISTRATORS ONLY
   ========================================================= */

router.post(
  "/create",
  adminAuth,
  async (req, res) => {
    try {
      const {
        title,
        duration,
        questions,
        subject,
        category,
        schoolId,
      } = req.body;

      /* -------------------------
         BASIC VALIDATION
         ------------------------- */

      if (
        !title ||
        !title.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Exam title is required.",
        });
      }

      if (!subject) {
        return res.status(400).json({
          success: false,
          message:
            "Subject is required.",
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message:
            "Category is required.",
        });
      }

      if (
        duration === undefined ||
        duration === null ||
        Number(duration) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid exam duration is required.",
        });
      }

      if (
        !Array.isArray(questions) ||
        questions.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one question is required.",
        });
      }


      /* -------------------------
         NORMALIZE QUESTIONS

         CreateExam currently works
         with optionA-D.

         Exam model uses:

         options: [
           optionA,
           optionB,
           optionC,
           optionD
         ]
         ------------------------- */

      const normalizedQuestions =
        questions.map(
          (item, index) => {
            const question =
              String(
                item.question || ""
              ).trim();

            let options = [];

            if (
              Array.isArray(
                item.options
              )
            ) {
              options =
                item.options.map(
                  (option) =>
                    String(
                      option || ""
                    ).trim()
                );
            } else {
              options = [
                item.optionA,
                item.optionB,
                item.optionC,
                item.optionD,
              ].map(
                (option) =>
                  String(
                    option || ""
                  ).trim()
              );
            }

            const answer =
              String(
                item.answer || ""
              ).trim();

            if (!question) {
              throw new Error(
                `Question ${index + 1} is empty.`
              );
            }

            if (
              options.length !== 4 ||
              options.some(
                (option) => !option
              )
            ) {
              throw new Error(
                `Question ${index + 1} must have exactly four options.`
              );
            }

            const uniqueOptions =
              new Set(
                options.map(
                  (option) =>
                    option.toLowerCase()
                )
              );

            if (
              uniqueOptions.size !== 4
            ) {
              throw new Error(
                `Question ${index + 1} contains duplicate options.`
              );
            }

            if (
              !options.includes(
                answer
              )
            ) {
              throw new Error(
                `Question ${index + 1} has an answer that does not match any option.`
              );
            }

            return {
              question,
              options,
              answer,
              difficulty: String(item.difficulty || 'medium').trim() || 'medium',
            };
          }
        );


      /* -------------------------
         CHECK DUPLICATE EXAM TITLE
         ------------------------- */

      const existingExam =
        await Exam.findOne({
          title: title.trim(),
        });

      if (existingExam) {
        return res.status(409).json({
          success: false,
          message:
            "An exam with this title already exists.",
        });
      }


      /* -------------------------
         DETERMINE SCHOOL

         A school administrator
         must use their own school.

         A super administrator may
         provide a schoolId.
         ------------------------- */

      let effectiveSchoolId =
        null;

      if (
        req.user?.role ===
        "school-admin"
      ) {
        effectiveSchoolId =
          req.user.schoolId || null;
      } else if (
        req.user?.role ===
        "super-admin"
      ) {
        effectiveSchoolId =
          schoolId ||
          req.user.schoolId ||
          null;
      }


      /* -------------------------
         CREATE EXAM
         ------------------------- */

      const exam =
        await Exam.create({
          title: title.trim(),

          duration:
            Number(duration),

          subject,

          category,

          questions:
            normalizedQuestions,

          schoolId:
            effectiveSchoolId,

          published: false,

          createdBy:
            req.user?._id || null,
        });


      return res.status(201).json({
        success: true,

        message:
          "Exam created successfully.",

        exam,
      });
    } catch (err) {
      console.error(
        "CREATE EXAM ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message ||
          "Unable to create exam.",
      });
    }
  }
);


/* =========================================================
   GET ALL EXAMS
   AUTHENTICATED USERS ONLY
   ========================================================= */

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const exams =
        await Exam.find()
          .sort({
            createdAt: -1,
          });

      return res.json({
        success: true,
        total: exams.length,
        exams,
      });
    } catch (err) {
      console.error(
        "GET EXAMS ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load exams.",
      });
    }
  }
);


/* =========================================================
   GET SINGLE EXAM
   AUTHENTICATED USERS ONLY
   ========================================================= */

router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      if (
        !id ||
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Exam ID.",
        });
      }

      const exam =
        await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }

      return res.json({
        success: true,
        exam,
      });
    } catch (err) {
      console.error(
        "GET SINGLE EXAM ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load exam.",
      });
    }
  }
);


/* =========================================================
   UPDATE EXAM
   ADMINISTRATORS ONLY
   ========================================================= */

router.put(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Exam ID.",
        });
      }

      const exam =
        await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }

      const {
        title,
        duration,
        subject,
        category,
        questions,
        published,
      } = req.body;


      if (
        title !== undefined
      ) {
        if (
          !String(title).trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Exam title cannot be empty.",
          });
        }

        exam.title =
          String(title).trim();
      }


      if (
        duration !== undefined
      ) {
        if (
          Number(duration) <= 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Exam duration must be greater than zero.",
          });
        }

        exam.duration =
          Number(duration);
      }


      if (
        subject !== undefined
      ) {
        if (
          !String(subject).trim()
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Subject cannot be empty.",
          });
        }

        exam.subject =
          String(subject).trim();
      }


      if (
        category !== undefined
      ) {
        exam.category =
          category;
      }


      if (
        questions !== undefined
      ) {
        if (
          !Array.isArray(
            questions
          ) ||
          questions.length === 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "At least one question is required.",
          });
        }

        const normalizedQuestions =
          questions.map(
            (item, index) => {
              const question =
                String(
                  item.question || ""
                ).trim();

              let options = [];

              if (
                Array.isArray(
                  item.options
                )
              ) {
                options =
                  item.options.map(
                    (option) =>
                      String(
                        option || ""
                      ).trim()
                  );
              } else {
                options = [
                  item.optionA,
                  item.optionB,
                  item.optionC,
                  item.optionD,
                ].map(
                  (option) =>
                    String(
                      option || ""
                    ).trim()
                );
              }

              const answer =
                String(
                  item.answer || ""
                ).trim();

              if (!question) {
                throw new Error(
                  `Question ${index + 1} is empty.`
                );
              }

              if (
                options.length !== 4 ||
                options.some(
                  (option) =>
                    !option
                )
              ) {
                throw new Error(
                  `Question ${index + 1} must have exactly four options.`
                );
              }

              const uniqueOptions =
                new Set(
                  options.map(
                    (option) =>
                      option.toLowerCase()
                  )
                );

              if (
                uniqueOptions.size !== 4
              ) {
                throw new Error(
                  `Question ${index + 1} contains duplicate options.`
                );
              }

              if (
                !options.includes(
                  answer
                )
              ) {
                throw new Error(
                  `Question ${index + 1} has an invalid answer.`
                );
              }

              return {
                question,
                options,
                answer,
              };
            }
          );

        exam.questions =
          normalizedQuestions;
      }


      if (
        published !== undefined
      ) {
        exam.published =
          Boolean(published);
      }


      await exam.save();

      return res.json({
        success: true,

        message:
          "Exam updated successfully.",

        exam,
      });
    } catch (err) {
      console.error(
        "UPDATE EXAM ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          err.message ||
          "Unable to update exam.",
      });
    }
  }
);


/* =========================================================
   DELETE EXAM
   ADMINISTRATORS ONLY
   ========================================================= */

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Exam ID.",
        });
      }

      const exam =
        await Exam.findById(id);

      if (!exam) {
        return res.status(404).json({
          success: false,
          message:
            "Exam not found.",
        });
      }

      await Exam.findByIdAndDelete(
        id
      );

      return res.json({
        success: true,

        message:
          "Exam deleted successfully.",
      });
    } catch (err) {
      console.error(
        "DELETE EXAM ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete exam.",
      });
    }
  }
);


module.exports = router;
