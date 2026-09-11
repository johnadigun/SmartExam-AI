/**
 * ============================================================
 * REMOVE DUPLICATE QUESTIONS (FAST VERSION)
 * backend/scripts/removeDuplicateQuestions.js
 * ============================================================
 */

require("dotenv").config();

const mongoose = require("mongoose");
const Question = require("../models/question");

async function removeDuplicates() {
  console.log("\n======================================");
  console.log(" REMOVING DUPLICATE QUESTIONS");
  console.log("======================================\n");

  const duplicates = await Question.aggregate([
    {
      $sort: { _id: 1 }
    },
    {
      $group: {
        _id: {
          subject: "$subject",
          question: "$question"
        },
        ids: { $push: "$_id" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $gt: 1 }
      }
    }
  ]);

  let removed = 0;

  for (const item of duplicates) {

    const keep = item.ids[0];

    const removeIds = item.ids.filter(id => id.toString() !== keep.toString());

    if (removeIds.length > 0) {

      const result = await Question.deleteMany({
        _id: { $in: removeIds }
      });

      removed += result.deletedCount;
    }
  }

  console.log("Duplicate Groups :", duplicates.length);
  console.log("Duplicates Removed :", removed);

  const remaining = await Question.countDocuments();

  console.log("Questions Remaining :", remaining);

  console.log("\nDuplicate removal completed.");
}

async function main() {

  console.log("Connecting to MongoDB...");

  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB Connected Successfully");

  await removeDuplicates();

  await mongoose.disconnect();

  console.log("Disconnected.");

  process.exit(0);
}

main().catch(err => {

  console.error(err);

  process.exit(1);

});