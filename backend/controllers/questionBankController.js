const QuestionBank = require("../models/QuestionBank");

// ================= ADD QUESTION =================
exports.addQuestion = async (req, res) => {
  try {
    const {
      schoolId,
      examBoard,
      subject,
      category,
      question,
      options,
      answer,
    } = req.body;

    let bank = await QuestionBank.findOne({
      schoolId,
      subject,
      examBoard,
    });

    if (!bank) {
      bank = new QuestionBank({
        schoolId,
        examBoard,
        subject,
        category,
        questions: [],
      });
    }

    bank.questions.push({
      question,
      options,
      answer,
    });

    await bank.save();

    res.json({
      success: true,
      message: "Question added successfully",
      bank,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};