/**
 * ============================================================
 * IMPORT QUESTIONS INTO MONGODB
 * Location:
 * backend/scripts/importQuestions.js
 * ============================================================
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Question = require("../models/question");

/* ============================================================
   CONNECT DATABASE
============================================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

/* ============================================================
   IMPORT ALL JSON FILES
============================================================ */

async function importQuestions() {
  try {
    const dataFolder = path.join(__dirname, "../data");

    if (!fs.existsSync(dataFolder)) {
      console.log("Data folder not found.");
      process.exit(0);
    }

    const files = fs
      .readdirSync(dataFolder)
      .filter((file) => file.endsWith(".json"));

    if (files.length === 0) {
      console.log("No JSON files found.");
      process.exit(0);
    }

    let totalImported = 0;
    let totalSkipped = 0;
    let totalInvalid = 0;

    console.log("\n======================================");
    console.log(" CBT QUESTION IMPORT");
    console.log("======================================\n");

    for (const file of files) {
      console.log(`Processing ${file} ...`);

      const filePath = path.join(dataFolder, file);

      const questions = JSON.parse(
        fs.readFileSync(filePath, "utf8")
      );

      let imported = 0;
      let skipped = 0;
      let invalid = 0;

      for (const q of questions) {
// Convert option object to array automatically
if (
  q.options &&
  !Array.isArray(q.options) &&
  typeof q.options === "object"
) {
  const optionMap = q.options;

  const optionArray = [
    optionMap.A,
    optionMap.B,
    optionMap.C,
    optionMap.D,
  ];

  if (["A", "B", "C", "D"].includes(q.answer)) {
    q.answer = optionMap[q.answer];
  }

  q.options = optionArray;
}
        /* ---------------- REQUIRED FIELDS ---------------- */

        if (
          !q.subject ||
          !q.question ||
          !q.answer ||
          !Array.isArray(q.options)
        ) {
          invalid++;
          continue;
        }

        /* ---------------- EXACTLY 4 OPTIONS ---------------- */

        if (q.options.length !== 4) {
          invalid++;
          continue;
        }

        /* ---------------- ANSWER MUST EXIST ---------------- */

        if (!q.options.includes(q.answer)) {
          invalid++;
          continue;
        }

        /* ---------------- CHECK DUPLICATE ---------------- */

        const exists = await Question.findOne({
          subject: q.subject,
          question: q.question,
        });

        if (exists) {
          skipped++;
          continue;
        }

        /* ---------------- SAVE ---------------- */

        const difficulty = (q.difficulty || "medium").toLowerCase();

await Question.create({
  subject: q.subject,
  category: q.category || "",
  question: q.question,
  options: q.options,
  answer: q.answer,
  year: q.year || "",
  exam: q.exam || "",
  difficulty,
});
        imported++;
      }

      totalImported += imported;
      totalSkipped += skipped;
      totalInvalid += invalid;

      console.log("-------------------------------------");
      console.log(`Subject File : ${file}`);
      console.log(`Imported     : ${imported}`);
      console.log(`Skipped      : ${skipped}`);
      console.log(`Invalid      : ${invalid}`);
      console.log("-------------------------------------\n");
    }

    console.log("\n======================================");
    console.log(" IMPORT SUMMARY");
    console.log("======================================");
    console.log("Imported :", totalImported);
    console.log("Skipped  :", totalSkipped);
    console.log("Invalid  :", totalInvalid);
    console.log("======================================\n");

    console.log("Question import completed successfully.");

    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

importQuestions();