
const axios = require("axios");

/*
==========================================================
SMARTEXAM CBT SYSTEM
PROFESSIONAL AI QUESTION GENERATOR
ADMIN ONLY
==========================================================
*/

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

const ALLOWED_DIFFICULTIES = [
  "Easy",
  "Medium",
  "Hard",
  "Mixed",
];

const ALLOWED_QUESTION_TYPES = [
  "Standard Curriculum",
  "Current / Recent",
  "Mixed",
];

function cleanText(value) {
  return String(value || "").trim();
}

function cleanQuestions(questions) {
  if (!Array.isArray(questions)) {
    return [];
  }

  return questions
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const question = cleanText(item.question);

      const options = Array.isArray(item.options)
        ? item.options
            .map(cleanText)
            .filter(Boolean)
            .slice(0, 4)
        : [];

      const answer = cleanText(item.answer);

      if (!question) {
        return null;
      }

      if (options.length !== 4) {
        return null;
      }

      if (!answer) {
        return null;
      }

      if (!options.includes(answer)) {
        return null;
      }

      const uniqueOptions = new Set(
        options.map((option) => option.toLowerCase())
      );

      if (uniqueOptions.size !== 4) {
        return null;
      }

      return {
        question,
        options,
        answer,
      };
    })
    .filter(Boolean);
}

exports.generateQuestions = async (req, res) => {
  try {
    /*
    ------------------------------------------------------
    ADMIN AUTHENTICATION
    ------------------------------------------------------
    */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Administrator authentication is required.",
      });
    }

    /*
    ------------------------------------------------------
    API CONFIGURATION
    ------------------------------------------------------
    */

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "AI question generation is not configured. Please add OPENAI_API_KEY to the backend .env file.",
      });
    }

    /*
    ------------------------------------------------------
    REQUEST DATA
    ------------------------------------------------------
    */

    const {
      subject,
      category,
      topic,
      numberOfQuestions,
      difficulty,
      questionType,
    } = req.body;

    const cleanSubject = cleanText(subject);
    const cleanCategory = cleanText(category);
    const cleanTopic = cleanText(topic);

    if (!cleanSubject) {
      return res.status(400).json({
        success: false,
        message: "Please select a subject.",
      });
    }

    if (!cleanCategory) {
      return res.status(400).json({
        success: false,
        message: "Please select an examination category.",
      });
    }

    const count = Number(numberOfQuestions);

    if (!Number.isInteger(count) || count < 1 || count > 50) {
      return res.status(400).json({
        success: false,
        message:
          "The number of AI questions must be between 1 and 50.",
      });
    }

    const selectedDifficulty =
      ALLOWED_DIFFICULTIES.includes(difficulty)
        ? difficulty
        : "Medium";

    const selectedQuestionType =
      ALLOWED_QUESTION_TYPES.includes(questionType)
        ? questionType
        : "Standard Curriculum";

    /*
    ------------------------------------------------------
    QUESTION TYPE INSTRUCTIONS
    ------------------------------------------------------
    */

    let questionTypeInstruction = "";

    if (selectedQuestionType === "Standard Curriculum") {
      questionTypeInstruction = `
Generate questions from established curriculum content
appropriate to the selected subject and examination category.

Do not invent curriculum facts.
`;
    }

    if (selectedQuestionType === "Current / Recent") {
      questionTypeInstruction = `
Generate questions dealing with genuinely current or recent
information relevant to the selected subject.

Only use information you are confident is factually correct.
Do not manufacture current events, dates, office holders,
statistics, policies, discoveries or other changing facts.

If a fact cannot be established reliably, do not use it.
`;
    }

    if (selectedQuestionType === "Mixed") {
      questionTypeInstruction = `
Generate a balanced mixture of established curriculum questions
and, where appropriate, genuinely current/recent questions.

Current/recent questions must contain factual information that
is reliable and not fabricated.
`;
    }

    /*
    ------------------------------------------------------
    TOPIC INSTRUCTION
    ------------------------------------------------------
    */

    const topicInstruction = cleanTopic
      ? `
The administrator specifically requested this topic/focus:

${cleanTopic}

Keep the generated questions strongly related to this topic.
`
      : `
No single topic was specified.

Select important and relevant areas of the selected subject
appropriate to the examination category.
`;

    /*
    ------------------------------------------------------
    PROFESSIONAL EXAMINATION PROMPT
    ------------------------------------------------------
    */

    const prompt = `
You are a professional examination question setter.

You are generating REAL examination-quality multiple-choice
questions for the SmartExam Computer-Based Testing system.

EXAMINATION INFORMATION

Subject:
${cleanSubject}

Category:
${cleanCategory}

Difficulty:
${selectedDifficulty}

Question Type:
${selectedQuestionType}

Number Required:
${count}

${topicInstruction}

${questionTypeInstruction}

==========================================================
QUALITY STANDARD
==========================================================

Every question MUST be:

1. A genuine, meaningful examination question.
2. Academically accurate.
3. Relevant to the selected subject.
4. Appropriate for the selected examination category.
5. Written in clear professional English.
6. Suitable for serious student examination practice.
7. Properly constructed as a multiple-choice question.
8. Free from ambiguity.
9. Free from grammatical errors.
10. Different from every other generated question.
11. Written so that there is ONE clearly correct answer.
12. Written with three plausible incorrect alternatives.

Do NOT generate:

- filler questions
- meaningless questions
- obvious questions merely to increase the count
- repeated questions
- near-duplicate questions
- trick questions caused by poor wording
- questions with two correct answers
- questions where none of the options is correct
- fabricated facts
- fabricated current events
- fake statistics
- fake quotations
- fake examination references
- explanations disguised as questions
- "What is the definition of..." repeatedly
- questions that reveal the answer through wording
- "All of the above"
- "None of the above"
- answer choices such as "A and B"
- placeholder text

==========================================================
ANSWER QUALITY
==========================================================

The four options must all be credible alternatives.

Do not make the correct answer consistently:

A
B
C
or D.

Distribute correct answers naturally across the questions.

The correct answer must exactly match one of the option strings.

==========================================================
NIGERIAN EXAMINATION QUALITY
==========================================================

Where appropriate, use the standard expected of serious
Nigerian secondary-school examination preparation.

Questions should test knowledge, understanding, application,
analysis or appropriate subject-specific reasoning rather than
simply repeating trivial facts.

Do not claim that a question is officially from JAMB, WAEC,
NECO or another examination unless it actually is.

==========================================================
OUTPUT
==========================================================

Return ONLY valid JSON.

Do not use Markdown.

Do not add commentary before or after the JSON.

Use exactly this structure:

{
  "questions": [
    {
      "question": "Actual examination question",
      "options": [
        "Option text",
        "Option text",
        "Option text",
        "Option text"
      ],
      "answer": "Exact correct option text"
    }
  ]
}

Return exactly ${count} questions whenever possible.
`;

    /*
    ------------------------------------------------------
    OPENAI REQUEST
    ------------------------------------------------------
    */

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model:
          process.env.OPENAI_MODEL ||
          "gpt-5.6-luna",

        input: prompt,

        text: {
          format: {
            type: "json_object",
          },
        },

        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },

        timeout: 120000,
      }
    );

    /*
    ------------------------------------------------------
    EXTRACT RESPONSE
    ------------------------------------------------------
    */

    const outputText =
      response?.data?.output_text ||
      response?.data?.output
        ?.flatMap((item) => item.content || [])
        ?.map((item) => item.text || "")
        ?.join("") ||
      "";

    if (!outputText) {
      return res.status(502).json({
        success: false,
        message:
          "The AI service returned no usable question data.",
      });
    }

    /*
    ------------------------------------------------------
    PARSE JSON
    ------------------------------------------------------
    */

    let parsed;

    try {
      parsed = JSON.parse(outputText);
    } catch (error) {
      console.error(
        "AI JSON parsing error:",
        error.message
      );

      console.error(
        "AI response:",
        outputText
      );

      return res.status(502).json({
        success: false,
        message:
          "The AI returned an invalid question format. Please generate again.",
      });
    }

    /*
    ------------------------------------------------------
    VALIDATE QUESTIONS
    ------------------------------------------------------
    */

    const questions = cleanQuestions(
      parsed?.questions
    );

    if (!questions.length) {
      return res.status(502).json({
        success: false,
        message:
          "The AI did not return valid examination questions.",
      });
    }

    /*
    ------------------------------------------------------
    RESPONSE
    ------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: `${questions.length} professional examination question${
        questions.length === 1 ? "" : "s"
      } generated successfully.`,

      questions,
    });
  } catch (error) {
    console.error(
      "AI question generation error:",
      error?.response?.data || error.message
    );

    if (error?.response?.status === 401) {
      return res.status(500).json({
        success: false,
        message:
          "The AI service rejected the API key. Please check OPENAI_API_KEY.",
      });
    }

    if (error?.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "The AI service is temporarily busy or the API limit has been reached. Please try again shortly.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate examination questions at this time.",
    });
  }
};