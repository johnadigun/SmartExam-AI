const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const InternationalQuestion =
  require("./InternationalQuestion");

/* ==========================================================
   IELTS ACADEMIC READING TEST QUESTIONS

   Purpose:
   - Verify InternationalQuestion database storage
   - Verify question API retrieval
   - Verify exam/module/section mapping

   This is a development test set.
========================================================== */

const IELTS_READING_QUESTIONS = [
  {
    examCode: "IELTS",
    moduleCode: "ACADEMIC",
    sectionCode: "READING",

    questionType: "MULTIPLE_CHOICE",

    question:
      "What is the main purpose of the passage?",

    instructions:
      "Choose the correct answer.",

    passage:
      "Researchers have increasingly studied how urban green spaces affect people's daily lives. Parks, gardens, and tree-lined streets can provide opportunities for exercise, relaxation, and social interaction. Recent studies suggest that access to green areas may also contribute to improved concentration and general well-being.",

    options: [
      {
        id: "A",
        text: "To describe the history of urban planning",
      },
      {
        id: "B",
        text: "To explain possible benefits of urban green spaces",
      },
      {
        id: "C",
        text: "To compare different types of buildings",
      },
      {
        id: "D",
        text: "To examine the cost of maintaining parks",
      },
    ],

    answer: "B",

    explanation:
      "The passage focuses on several possible benefits of urban green spaces, including exercise, relaxation, social interaction, concentration, and well-being.",

    difficulty: "EASY",

    marks: 1,

    negativeMarks: 0,

    scoringType: "EXACT",

    questionNumber: 1,

    active: true,

    tags: [
      "IELTS",
      "Academic",
      "Reading",
      "Main Idea",
    ],

    source:
      "SmartExam International Development Question Bank",

    version: 1,
  },

  {
    examCode: "IELTS",
    moduleCode: "ACADEMIC",
    sectionCode: "READING",

    questionType: "TRUE_FALSE",

    question:
      "Urban green spaces can provide opportunities for social interaction.",

    instructions:
      "Choose TRUE, FALSE, or NOT GIVEN.",

    passage:
      "Researchers have increasingly studied how urban green spaces affect people's daily lives. Parks, gardens, and tree-lined streets can provide opportunities for exercise, relaxation, and social interaction. Recent studies suggest that access to green areas may also contribute to improved concentration and general well-being.",

    options: [
      {
        id: "TRUE",
        text: "TRUE",
      },
      {
        id: "FALSE",
        text: "FALSE",
      },
      {
        id: "NOT_GIVEN",
        text: "NOT GIVEN",
      },
    ],

    answer: "TRUE",

    explanation:
      "The passage explicitly states that parks, gardens, and tree-lined streets can provide opportunities for social interaction.",

    difficulty: "EASY",

    marks: 1,

    negativeMarks: 0,

    scoringType: "EXACT",

    questionNumber: 2,

    active: true,

    tags: [
      "IELTS",
      "Academic",
      "Reading",
      "True False Not Given",
    ],

    source:
      "SmartExam International Development Question Bank",

    version: 1,
  },

  {
    examCode: "IELTS",
    moduleCode: "ACADEMIC",
    sectionCode: "READING",

    questionType: "MULTIPLE_CHOICE",

    question:
      "Which benefit is mentioned in relation to access to green areas?",

    instructions:
      "Choose the correct answer.",

    passage:
      "Researchers have increasingly studied how urban green spaces affect people's daily lives. Parks, gardens, and tree-lined streets can provide opportunities for exercise, relaxation, and social interaction. Recent studies suggest that access to green areas may also contribute to improved concentration and general well-being.",

    options: [
      {
        id: "A",
        text: "Improved concentration",
      },
      {
        id: "B",
        text: "Higher housing prices",
      },
      {
        id: "C",
        text: "Reduced transportation costs",
      },
      {
        id: "D",
        text: "Longer working hours",
      },
    ],

    answer: "A",

    explanation:
      "The passage states that access to green areas may contribute to improved concentration.",

    difficulty: "EASY",

    marks: 1,

    negativeMarks: 0,

    scoringType: "EXACT",

    questionNumber: 3,

    active: true,

    tags: [
      "IELTS",
      "Academic",
      "Reading",
      "Specific Information",
    ],

    source:
      "SmartExam International Development Question Bank",

    version: 1,
  },

  {
    examCode: "IELTS",
    moduleCode: "ACADEMIC",
    sectionCode: "READING",

    questionType: "FILL_IN_THE_BLANK",

    question:
      "Access to green areas may contribute to improved ______.",

    instructions:
      "Complete the sentence using NO MORE THAN TWO WORDS.",

    passage:
      "Researchers have increasingly studied how urban green spaces affect people's daily lives. Parks, gardens, and tree-lined streets can provide opportunities for exercise, relaxation, and social interaction. Recent studies suggest that access to green areas may also contribute to improved concentration and general well-being.",

    answer: "concentration",

    explanation:
      "The passage states that access to green areas may contribute to improved concentration.",

    difficulty: "MEDIUM",

    marks: 1,

    negativeMarks: 0,

    scoringType: "EXACT",

    questionNumber: 4,

    active: true,

    tags: [
      "IELTS",
      "Academic",
      "Reading",
      "Sentence Completion",
    ],

    source:
      "SmartExam International Development Question Bank",

    version: 1,
  },

  {
    examCode: "IELTS",
    moduleCode: "ACADEMIC",
    sectionCode: "READING",

    questionType: "MULTIPLE_RESPONSE",

    question:
      "Which two activities are directly mentioned as possible uses of green spaces?",

    instructions:
      "Select TWO answers.",

    passage:
      "Researchers have increasingly studied how urban green spaces affect people's daily lives. Parks, gardens, and tree-lined streets can provide opportunities for exercise, relaxation, and social interaction. Recent studies suggest that access to green areas may also contribute to improved concentration and general well-being.",

    options: [
      {
        id: "A",
        text: "Exercise",
      },
      {
        id: "B",
        text: "Relaxation",
      },
      {
        id: "C",
        text: "Shopping",
      },
      {
        id: "D",
        text: "Driving",
      },
    ],

    answer: ["A", "B"],

    answerConfiguration: {
      requiredAnswers: 2,
    },

    explanation:
      "The passage directly identifies exercise and relaxation as activities associated with green spaces.",

    difficulty: "MEDIUM",

    marks: 1,

    negativeMarks: 0,

    scoringType: "EXACT",

    questionNumber: 5,

    active: true,

    tags: [
      "IELTS",
      "Academic",
      "Reading",
      "Multiple Response",
    ],

    source:
      "SmartExam International Development Question Bank",

    version: 1,
  },
];

/* ==========================================================
   SEED FUNCTION
========================================================== */

async function seedInternationalQuestions() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from the environment."
      );
    }

    console.log(
      "Connecting to MongoDB..."
    );

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected Successfully"
    );

    /* ------------------------------------------------------
       Remove only the development IELTS Academic Reading
       questions created by this seed.
    ------------------------------------------------------ */

    const deleteResult =
      await InternationalQuestion.deleteMany({
        examCode: "IELTS",
        moduleCode: "ACADEMIC",
        sectionCode: "READING",
        source:
          "SmartExam International Development Question Bank",
      });

    console.log(
      "Existing development questions removed:",
      deleteResult.deletedCount
    );

    /* ------------------------------------------------------
       Insert fresh development questions
    ------------------------------------------------------ */

    const insertedQuestions =
      await InternationalQuestion.insertMany(
        IELTS_READING_QUESTIONS
      );

    console.log(
      "International questions inserted:",
      insertedQuestions.length
    );

    /* ------------------------------------------------------
       Verify insertion
    ------------------------------------------------------ */

    const count =
      await InternationalQuestion.countDocuments({
        examCode: "IELTS",
        moduleCode: "ACADEMIC",
        sectionCode: "READING",
        active: true,
      });

    console.log(
      "Active IELTS Academic Reading questions:",
      count
    );

    console.log(
      "International question seed completed successfully."
    );

  } catch (error) {

    console.error(
      "International question seed failed:",
      error
    );

    process.exitCode = 1;

  } finally {

    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );
  }
}

/* ==========================================================
   RUN SEED
========================================================== */

seedInternationalQuestions();