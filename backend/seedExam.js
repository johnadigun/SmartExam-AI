const mongoose = require("mongoose");
require("dotenv").config();

const Exam = require("./models/Exam");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await Exam.deleteMany({});

    await Exam.create({
      title: "WAEC Mathematics Mock",
      duration: 60,
      questions: [
        {
          question: "2 + 2 = ?",
          options: ["2", "3", "4", "5"],
          answer: "4"
        },
        {
          question: "5 x 5 = ?",
          options: ["10", "20", "25", "30"],
          answer: "25"
        }
      ]
    });

    console.log("Exam Seeded Successfully");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });