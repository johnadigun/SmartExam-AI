const mongoose = require("mongoose");
const dotenv = require("dotenv");

const InternationalExam = require("./InternationalExam");

dotenv.config();

/* ==========================================================
   INTERNATIONAL EXAMINATION SEED DATA

   This file creates the initial International examination
   catalogue used by SmartExam.

   It does NOT create questions.

   Questions will be added later through the
   InternationalQuestion collection.
========================================================== */

const internationalExams = [
  /* ========================================================
     IELTS
  ======================================================== */

  {
    code: "IELTS",
    name: "IELTS",
    fullName:
      "International English Language Testing System",

    description:
      "International English language proficiency examination.",

    provider:
      "IELTS Partners",

    examType:
      "ENGLISH_LANGUAGE",

    active: true,

    modules: [
      {
        code: "ACADEMIC",
        name: "Academic",
        description:
          "IELTS Academic examination.",
        active: true,

        sections: [
          {
            code: "LISTENING",
            name: "Listening",
            description:
              "Listening assessment.",
            duration: 30,
            questionCount: 0,
            active: true,
          },

          {
            code: "READING",
            name: "Reading",
            description:
              "Academic reading assessment.",
            duration: 60,
            questionCount: 0,
            active: true,
          },

          {
            code: "WRITING",
            name: "Writing",
            description:
              "Academic writing assessment.",
            duration: 60,
            questionCount: 0,
            active: true,
          },

          {
            code: "SPEAKING",
            name: "Speaking",
            description:
              "Speaking assessment.",
            duration: 14,
            questionCount: 0,
            active: true,
          },
        ],
      },

      {
        code: "GENERAL_TRAINING",
        name: "General Training",
        description:
          "IELTS General Training examination.",
        active: true,

        sections: [
          {
            code: "LISTENING",
            name: "Listening",
            description:
              "Listening assessment.",
            duration: 30,
            questionCount: 0,
            active: true,
          },

          {
            code: "READING",
            name: "Reading",
            description:
              "General Training reading assessment.",
            duration: 60,
            questionCount: 0,
            active: true,
          },

          {
            code: "WRITING",
            name: "Writing",
            description:
              "General Training writing assessment.",
            duration: 60,
            questionCount: 0,
            active: true,
          },

          {
            code: "SPEAKING",
            name: "Speaking",
            description:
              "Speaking assessment.",
            duration: 14,
            questionCount: 0,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "BAND",
      passingScore: null,
      maximumScore: 9,
      minimumScore: 0,
      description:
        "IELTS uses band scores.",
    },
  },

  /* ========================================================
     TOEFL
  ======================================================== */

  {
    code: "TOEFL",
    name: "TOEFL",
    fullName:
      "Test of English as a Foreign Language",

    description:
      "International English language proficiency examination.",

    provider:
      "ETS",

    examType:
      "ENGLISH_LANGUAGE",

    active: true,

    modules: [
      {
        code: "IBT",
        name: "TOEFL iBT",
        description:
          "Internet-based TOEFL examination.",
        active: true,

        sections: [
          {
            code: "READING",
            name: "Reading",
            description:
              "Reading assessment.",
            duration: 30,
            questionCount: 0,
            active: true,
          },

          {
            code: "LISTENING",
            name: "Listening",
            description:
              "Listening assessment.",
            duration: 29,
            questionCount: 0,
            active: true,
          },

          {
            code: "WRITING",
            name: "Writing",
            description:
              "Writing assessment.",
            duration: 23,
            questionCount: 0,
            active: true,
          },

          {
            code: "SPEAKING",
            name: "Speaking",
            description:
              "Speaking assessment.",
            duration: 8,
            questionCount: 0,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "BAND",
      passingScore: null,
      maximumScore: 6,
      minimumScore: 1,
      description:
        "Current TOEFL iBT score reporting uses a 1–6 scale, with a comparable 0–120 score during the transition period.",
    },
  },

  /* ========================================================
     SAT
  ======================================================== */

  {
    code: "SAT",
    name: "SAT",
    fullName:
      "SAT",

    description:
      "Digital college admission examination.",

    provider:
      "College Board",

    examType:
      "COLLEGE_ADMISSIONS",

    active: true,

    modules: [
      {
        code: "GENERAL",
        name: "SAT",
        description:
          "Standard digital SAT examination.",
        active: true,

        sections: [
          {
            code: "READING_WRITING",
            name: "Reading and Writing",
            description:
              "Digital SAT Reading and Writing section.",
            duration: 64,
            questionCount: 54,
            active: true,
          },

          {
            code: "MATH",
            name: "Math",
            description:
              "Digital SAT Math section.",
            duration: 70,
            questionCount: 44,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "SCORE",
      passingScore: null,
      maximumScore: 1600,
      minimumScore: 400,
      description:
        "SAT total score is reported on a 400–1600 scale.",
    },
  },

  /* ========================================================
     GRE
  ======================================================== */

  {
    code: "GRE",
    name: "GRE",
    fullName:
      "Graduate Record Examinations General Test",

    description:
      "Graduate-level admissions examination.",

    provider:
      "ETS",

    examType:
      "GRADUATE_ADMISSIONS",

    active: true,

    modules: [
      {
        code: "GENERAL",
        name: "General Test",
        description:
          "GRE General Test.",
        active: true,

        sections: [
          {
            code: "ANALYTICAL_WRITING",
            name: "Analytical Writing",
            description:
              "Analyze an Issue writing task.",
            duration: 30,
            questionCount: 1,
            active: true,
          },

          {
            code: "VERBAL_REASONING",
            name: "Verbal Reasoning",
            description:
              "Verbal reasoning assessment.",
            duration: 41,
            questionCount: 27,
            active: true,
          },

          {
            code: "QUANTITATIVE_REASONING",
            name: "Quantitative Reasoning",
            description:
              "Quantitative reasoning assessment.",
            duration: 47,
            questionCount: 27,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "SCORE",
      passingScore: null,
      maximumScore: 170,
      minimumScore: 130,
      description:
        "GRE Verbal and Quantitative scores use a 130–170 scale; Analytical Writing uses a separate 0–6 scale.",
    },
  },

  /* ========================================================
     GMAT
  ======================================================== */

  {
    code: "GMAT",
    name: "GMAT",
    fullName:
      "Graduate Management Admission Test",

    description:
      "Graduate management admissions examination.",

    provider:
      "Graduate Management Admission Council",

    examType:
      "GRADUATE_MANAGEMENT_ADMISSIONS",

    active: true,

    modules: [
      {
        code: "GENERAL",
        name: "GMAT Exam",
        description:
          "Current GMAT examination.",
        active: true,

        sections: [
          {
            code: "QUANTITATIVE_REASONING",
            name: "Quantitative Reasoning",
            description:
              "Quantitative reasoning assessment.",
            duration: 45,
            questionCount: 21,
            active: true,
          },

          {
            code: "VERBAL_REASONING",
            name: "Verbal Reasoning",
            description:
              "Verbal reasoning assessment.",
            duration: 45,
            questionCount: 23,
            active: true,
          },

          {
            code: "DATA_INSIGHTS",
            name: "Data Insights",
            description:
              "Data analysis and reasoning assessment.",
            duration: 45,
            questionCount: 20,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "SCORE",
      passingScore: null,
      maximumScore: null,
      minimumScore: null,
      description:
        "GMAT uses its own score scale and scoring methodology.",
    },
  },

  /* ========================================================
     CAMBRIDGE ENGLISH
  ======================================================== */

  {
    code: "CAMBRIDGE_ENGLISH",
    name: "Cambridge English",
    fullName:
      "Cambridge English Qualifications",

    description:
      "Family of internationally recognised English language qualifications.",

    provider:
      "Cambridge University Press & Assessment",

    examType:
      "ENGLISH_LANGUAGE",

    active: true,

    modules: [
      {
        code: "B2_FIRST",
        name: "B2 First",
        description:
          "Cambridge English B2 First qualification.",
        active: true,

        sections: [
          {
            code: "READING_USE_OF_ENGLISH",
            name: "Reading and Use of English",
            description:
              "Reading and Use of English assessment.",
            duration: 75,
            questionCount: 0,
            active: true,
          },

          {
            code: "WRITING",
            name: "Writing",
            description:
              "Writing assessment.",
            duration: 80,
            questionCount: 0,
            active: true,
          },

          {
            code: "LISTENING",
            name: "Listening",
            description:
              "Listening assessment.",
            duration: 40,
            questionCount: 0,
            active: true,
          },

          {
            code: "SPEAKING",
            name: "Speaking",
            description:
              "Speaking assessment.",
            duration: 14,
            questionCount: 0,
            active: true,
          },
        ],
      },

      {
        code: "C1_ADVANCED",
        name: "C1 Advanced",
        description:
          "Cambridge English C1 Advanced qualification.",
        active: true,

        sections: [
          {
            code: "READING_USE_OF_ENGLISH",
            name: "Reading and Use of English",
            description:
              "Reading and Use of English assessment.",
            duration: 90,
            questionCount: 56,
            active: true,
          },

          {
            code: "WRITING",
            name: "Writing",
            description:
              "Writing assessment.",
            duration: 90,
            questionCount: 0,
            active: true,
          },

          {
            code: "LISTENING",
            name: "Listening",
            description:
              "Listening assessment.",
            duration: 40,
            questionCount: 30,
            active: true,
          },

          {
            code: "SPEAKING",
            name: "Speaking",
            description:
              "Speaking assessment.",
            duration: 15,
            questionCount: 0,
            active: true,
          },
        ],
      },

      {
        code: "C2_PROFICIENCY",
        name: "C2 Proficiency",
        description:
          "Cambridge English C2 Proficiency qualification.",
        active: true,

        sections: [
          {
            code: "READING_USE_OF_ENGLISH",
            name: "Reading and Use of English",
            description:
              "Reading and Use of English assessment.",
            duration: 90,
            questionCount: 0,
            active: true,
          },

          {
            code: "WRITING",
            name: "Writing",
            description:
              "Writing assessment.",
            duration: 90,
            questionCount: 0,
            active: true,
          },

          {
            code: "LISTENING",
            name: "Listening",
            description:
              "Listening assessment.",
            duration: 40,
            questionCount: 0,
            active: true,
          },

          {
            code: "SPEAKING",
            name: "Speaking",
            description:
              "Speaking assessment.",
            duration: 16,
            questionCount: 0,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "SCORE",
      passingScore: null,
      maximumScore: null,
      minimumScore: null,
      description:
        "Cambridge English qualifications report Cambridge English Scale scores and CEFR levels.",
    },
  },

  /* ========================================================
     PTE ACADEMIC
  ======================================================== */

  {
    code: "PTE",
    name: "PTE Academic",
    fullName:
      "Pearson Test of English Academic",

    description:
      "Computer-based academic English language examination.",

    provider:
      "Pearson",

    examType:
      "ENGLISH_LANGUAGE",

    active: true,

    modules: [
      {
        code: "ACADEMIC",
        name: "PTE Academic",
        description:
          "PTE Academic examination.",
        active: true,

        sections: [
          {
            code: "SPEAKING_WRITING",
            name: "Speaking and Writing",
            description:
              "PTE Academic Speaking and Writing section.",
            duration: 84,
            questionCount: 0,
            active: true,
          },

          {
            code: "READING",
            name: "Reading",
            description:
              "PTE Academic Reading section.",
            duration: 30,
            questionCount: 0,
            active: true,
          },

          {
            code: "LISTENING",
            name: "Listening",
            description:
              "PTE Academic Listening section.",
            duration: 39,
            questionCount: 0,
            active: true,
          },
        ],
      },
    ],

    scoring: {
      type: "SCORE",
      passingScore: null,
      maximumScore: 90,
      minimumScore: 10,
      description:
        "PTE Academic uses a 10–90 score scale.",
    },
  },

  /* ========================================================
     INTERNATIONAL PROFESSIONAL EXAMINATIONS
  ======================================================== */

  {
    code: "INTERNATIONAL_PROFESSIONAL",
    name: "International Professional Examinations",
    fullName:
      "International Professional Examinations",

    description:
      "International professional and certification examinations supported by SmartExam.",

    provider:
      "Various International Examination Bodies",

    examType:
      "PROFESSIONAL",

    active: true,

    modules: [
      {
        code: "GENERAL",
        name: "Professional Examination",
        description:
          "General configuration for supported professional examinations.",
        active: true,

        sections: [],
      },
    ],

    scoring: {
      type: "FLEXIBLE",
      passingScore: null,
      maximumScore: null,
      minimumScore: null,
      description:
        "Scoring depends on the individual professional examination.",
    },
  },
];

/* ==========================================================
   SEED FUNCTION
========================================================== */

async function seedInternationalExams() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in the environment."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log(
      "MongoDB connected for International examination seed."
    );

    let inserted = 0;
    let updated = 0;

    for (const examData of internationalExams) {
      const existingExam =
        await InternationalExam.findOne({
          code: examData.code,
        });

      if (existingExam) {
        await InternationalExam.updateOne(
          {
            code: examData.code,
          },
          {
            $set: examData,
          }
        );

        updated++;

        console.log(
          `Updated International examination: ${examData.code}`
        );

      } else {
        await InternationalExam.create(
          examData
        );

        inserted++;

        console.log(
          `Inserted International examination: ${examData.code}`
        );
      }
    }

    console.log(
      "--------------------------------------------------"
    );

    console.log(
      `International examination seed completed. Inserted: ${inserted}, Updated: ${updated}`
    );

    const total =
      await InternationalExam.countDocuments({
        active: true,
      });

    console.log(
      `Active International examinations in database: ${total}`
    );

  } catch (error) {

    console.error(
      "International examination seed error:",
      error
    );

    process.exitCode = 1;

  } finally {

    await mongoose.disconnect();

    console.log(
      "MongoDB connection closed."
    );
  }
}

/* ==========================================================
   RUN SEED
========================================================== */

seedInternationalExams();