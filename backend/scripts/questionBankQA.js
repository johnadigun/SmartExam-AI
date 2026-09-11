const mongoose = require("mongoose");
require("dotenv").config();

const Question = require("../models/Question");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("");
    console.log("==============================================");
    console.log("     CBT QUESTION BANK QA");
    console.log("==============================================");
    console.log("MongoDB Connected Successfully");
    console.log("");

  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error.message);
    process.exit(1);
  }
}

function normalizeText(text) {
  if (!text) return "";

  return text
    .toString()
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function createSubjectReport() {
  return {
    totalQuestions: 0,
    duplicateQuestions: 0,
    duplicateIds: 0,
    emptyQuestions: 0,
    missingOptions: 0,
    invalidOptionCount: 0,
    missingAnswer: 0,
    answerNotFound: 0,
    missingSubject: 0,
    missingCategory: 0
  };
}

async function runQA() {

  const questions = await Question.find({}).lean();

  if (!questions.length) {
    console.log("No questions found.");
    return;
  }

  console.log(`Total Questions Loaded : ${questions.length}`);
  console.log("");

  const reports = {};

  const duplicateQuestionMap = {};

  const duplicateIdMap = {};

  for (const question of questions) {

    const subject =
      question.subject || "UNKNOWN SUBJECT";

    if (!reports[subject]) {
      reports[subject] = createSubjectReport();
    }

    const report = reports[subject];

    report.totalQuestions++;

    /* duplicate _id */

    const idKey = String(question._id);

    duplicateIdMap[idKey] =
      (duplicateIdMap[idKey] || 0) + 1;

    /* duplicate question */

    const questionKey =
      subject +
      "||" +
      normalizeText(question.question);

    duplicateQuestionMap[questionKey] =
      (duplicateQuestionMap[questionKey] || 0) + 1;

    /* empty question */

    if (!question.question || !question.question.trim()) {
      report.emptyQuestions++;
    }

    /* subject */

    if (!question.subject) {
      report.missingSubject++;
    }

    /* category */

    if (!question.category) {
      report.missingCategory++;
    }

    /* options */

    if (!Array.isArray(question.options)) {
      report.invalidOptionCount++;
    } else {

      if (question.options.length !== 4) {
        report.invalidOptionCount++;
      }

      const emptyOption =
        question.options.some(
          option => !String(option).trim()
        );

      if (emptyOption) {
        report.missingOptions++;
      }

      if (!question.answer) {
        report.missingAnswer++;
      } else {

        const found =
          question.options.includes(question.answer);

        if (!found) {
          report.answerNotFound++;
        }
      }
    }

  }
  /* ==========================================
     DUPLICATE CHECK
  ========================================== */

  Object.keys(duplicateQuestionMap).forEach((key) => {

    if (duplicateQuestionMap[key] > 1) {

      const subject = key.split("||")[0];

      reports[subject].duplicateQuestions +=
        duplicateQuestionMap[key] - 1;
    }

  });

  Object.keys(duplicateIdMap).forEach((key) => {

    if (duplicateIdMap[key] > 1) {

      questions.forEach((q) => {

        if (String(q._id) === key) {

          reports[q.subject].duplicateIds +=
            duplicateIdMap[key] - 1;
        }

      });

    }

  });

  /* ==========================================
     REPORT
  ========================================== */

  console.log("==============================================");
  console.log("        CBT QUESTION BANK QA REPORT");
  console.log("==============================================");
  console.log("");

  let totalSubjects = 0;
  let totalQuestions = 0;
  let totalPass = 0;
  let totalFail = 0;

  const subjects = Object.keys(reports).sort();

  subjects.forEach((subject) => {

    totalSubjects++;

    const r = reports[subject];

    totalQuestions += r.totalQuestions;

    const errors =
      r.duplicateQuestions +
      r.duplicateIds +
      r.emptyQuestions +
      r.missingOptions +
      r.invalidOptionCount +
      r.missingAnswer +
      r.answerNotFound +
      r.missingSubject +
      r.missingCategory;

    if (errors === 0) {
      totalPass++;
    } else {
      totalFail++;
    }

    console.log("----------------------------------------------");
    console.log(`Subject              : ${subject}`);
    console.log(`Questions            : ${r.totalQuestions}`);
    console.log(`Duplicate Questions  : ${r.duplicateQuestions}`);
    console.log(`Duplicate IDs        : ${r.duplicateIds}`);
    console.log(`Empty Questions      : ${r.emptyQuestions}`);
    console.log(`Missing Options      : ${r.missingOptions}`);
    console.log(`Invalid Option Count : ${r.invalidOptionCount}`);
    console.log(`Missing Answers      : ${r.missingAnswer}`);
    console.log(`Answer Not In Option : ${r.answerNotFound}`);
    console.log(`Missing Subject      : ${r.missingSubject}`);
    console.log(`Missing Category     : ${r.missingCategory}`);

    console.log(
      `STATUS               : ${
        errors === 0 ? "PASS ✅" : "FAIL ❌"
      }`
    );

    console.log("");

  });
  console.log("==============================================");
  console.log("               FINAL SUMMARY");
  console.log("==============================================");
  console.log(`Subjects Checked : ${totalSubjects}`);
  console.log(`Total Questions  : ${totalQuestions}`);
  console.log(`PASS             : ${totalPass}`);
  console.log(`FAIL             : ${totalFail}`);
  console.log("==============================================");

  await mongoose.connection.close();

  console.log("");
  console.log("MongoDB Connection Closed.");
  console.log("QA Completed Successfully.");
}

/* ==========================================
   MAIN
========================================== */

async function main() {

  try {

    await connectDatabase();

    await runQA();

    process.exit(0);

  } catch (error) {

    console.error(error);

    await mongoose.connection.close();

    process.exit(1);

  }

}

main();