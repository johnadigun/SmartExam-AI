const express = require("express");
const router = express.Router();

const Exam = require("../models/exam");
const access = require("../middleware/accessMiddleware");

/* ======================================================
   AI EXAM GENERATOR (OPTION A - HYBRID CBT SYSTEM)
====================================================== */

router.post("/generate", access, async (req, res) => {
  try {
    const { subject, level = "WAEC/JAMB", count = 20 } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    /* ================= AI PROMPT ================= */
    const prompt = `
Generate ${count} CBT multiple choice questions.

Subject: ${subject}
Level: ${level}

Requirements:
- 4 options per question (A, B, C, D)
- Only one correct answer
- Mix difficulty (easy, medium, hard)
- Exam standard format

Return ONLY valid JSON in this format:

{
  "title": "${subject} CBT Exam",
  "duration": 60,
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "answer": ""
    }
  ]
}
`;

    /* ======================================================
       CALL TO AI ENGINE (OpenAI / GPT / Gemini Compatible)
    ====================================================== */

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();

    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate exam",
      });
    }

    let examData;

    try {
      examData = JSON.parse(content);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response format",
      });
    }

    /* ================= SAVE TO DATABASE ================= */

    const exam = await Exam.create({
      title: examData.title,
      duration: examData.duration || 60,
      questions: examData.questions,
      type: "cbt",
      category: subject,
      createdBy: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "AI Exam generated successfully",
      exam,
    });

  } catch (err) {
    console.log("AI GENERATION ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
