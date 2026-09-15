
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
  "Very Hard",
  "Mixed",
];

const ALLOWED_QUESTION_TYPES = [
  "Standard Curriculum",
  "Current / Recent",
  "Mixed",
];

const NORMALIZED_DIFFICULTIES = [
  "easy",
  "medium",
  "hard",
  "very hard",
];

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeDifficulty(value) {
  const difficulty = cleanText(value).toLowerCase();

  if (difficulty === "easy") return "Easy";
  if (difficulty === "medium") return "Medium";
  if (difficulty === "hard") return "Hard";
  if (
    difficulty === "very hard" ||
    difficulty === "veryhard" ||
    difficulty === "very-hard"
  ) {
    return "Very Hard";
  }

  return "";
}

function cleanQuestions(questions, requestedDifficulty) {
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

      /*
      ------------------------------------------------------
      DIFFICULTY
      ------------------------------------------------------
      */

      let difficulty = normalizeDifficulty(item.difficulty);

      /*
      If the AI does not return a difficulty, use the
      administrator's requested difficulty.

      For Mixed generation, Medium is used as the safe
      fallback rather than falsely calling a question Hard
      or Very Hard.
      */

      if (!difficulty) {
        if (
          requestedDifficulty &&
          requestedDifficulty !== "Mixed"
        ) {
          difficulty = requestedDifficulty;
        } else {
          difficulty = "Medium";
        }
      }

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
        difficulty,
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
    DIFFICULTY INSTRUCTIONS
    ------------------------------------------------------
    */

    let difficultyInstruction = "";

    if (selectedDifficulty === "Easy") {
      difficultyInstruction = `
DIFFICULTY LEVEL: EASY

Questions may test fundamental knowledge, basic understanding
and straightforward application.

Do not make questions unnecessarily difficult.
`;
    }

    if (selectedDifficulty === "Medium") {
      difficultyInstruction = `
DIFFICULTY LEVEL: MEDIUM

Do NOT produce trivial recall questions.

Questions should require genuine understanding and application
of the subject matter.

Where appropriate, require the candidate to:
- interpret information
- apply a known principle
- perform a moderate calculation
- distinguish between closely related concepts
- select the best answer from plausible alternatives

The question should require thought, but should remain suitable
for a competent secondary-school candidate.
`;
    }

    if (selectedDifficulty === "Hard") {
      difficultyInstruction = `
DIFFICULTY LEVEL: HARD

These must be genuinely challenging examination questions.

Do NOT merely rename a simple recall question as Hard.

Questions should require one or more of the following where
appropriate to the subject:

- multi-step reasoning
- application of concepts in unfamiliar situations
- interpretation of data, information or scenarios
- combining two or more relevant concepts
- non-trivial calculation
- careful analysis
- comparison of closely related principles
- identification of the best conclusion from plausible alternatives

Incorrect options must be realistic and competitive.

Avoid giveaway wording.

A well-prepared candidate should need to think carefully before
selecting the answer.
`;
    }

    if (selectedDifficulty === "Very Hard") {
      difficultyInstruction = `
DIFFICULTY LEVEL: VERY HARD

These must be genuinely demanding examination questions.

Do NOT create a normal question and simply label it Very Hard.

Questions should challenge a strong candidate through appropriate
use of:

- multi-concept reasoning
- multi-step analysis
- unfamiliar but valid applications
- complex interpretation
- difficult calculations where relevant
- subtle distinctions between closely related concepts
- analysis of scenarios, data, diagrams or statements where
  appropriate
- selecting the best conclusion when several options appear
  initially plausible

The question must remain academically fair and answerable from
the required curriculum knowledge.

Distractors must be sophisticated, plausible and clearly wrong
only after proper reasoning.

Avoid obscure trivia and avoid ambiguity.

Very Hard means intellectually demanding, not poorly written.
`;
    }

    if (selectedDifficulty === "Mixed") {
      difficultyInstruction = `
DIFFICULTY LEVEL: MIXED

Create a meaningful mixture of Easy, Medium, Hard and Very Hard
questions.

The difficulty must be genuinely different between questions.

Do not simply label easy questions as Hard or Very Hard.

Where appropriate, include:
- straightforward foundational questions
- application questions
- multi-step reasoning questions
- demanding analytical questions

Return the actual difficulty level for every question.
`;
    }

    /*
    ------------------------------------------------------
    PROFESSIONAL EXAMINATION PROMPT
    ------------------------------------------------------
    */

    const prompt = `
You are a professional examination question setter with expertise
in Nigerian secondary-school examination standards.

You are generating REAL examination-quality multiple-choice
questions for the SmartExam Computer-Based Testing system.

The questions must be substantially better than simple classroom
recall questions when the requested difficulty is Medium, Hard or
Very Hard.

EXAMINATION INFORMATION

Subject:
${cleanSubject}

Category:
${cleanCategory}

Requested Difficulty:
${selectedDifficulty}

Question Type:
${selectedQuestionType}

Number Required:
${count}

${topicInstruction}

${questionTypeInstruction}

${difficultyInstruction}

==========================================================
NIGERIAN EXAMINATION STANDARD
==========================================================

Where appropriate, write questions at the level expected from
serious preparation for major Nigerian secondary-school and
entrance examinations such as JAMB, WAEC and NECO.

Do not claim that a question is officially from JAMB, WAEC, NECO
or another examination unless it actually is.

The goal is to reproduce the QUALITY and intellectual standard
of serious examination preparation, not to falsely reproduce
official examination questions.

Questions should test:

- knowledge
- understanding
- application
- analysis
- interpretation
- reasoning
- problem solving
- subject-specific judgment

Use the appropriate skills for the selected subject.

==========================================================
QUALITY STANDARD
==========================================================

Every question MUST be:

1. A genuine, meaningful examination question.
2. Academically accurate.
3. Relevant to the selected subject.
4. Appropriate to the selected examination category.
5. Written in clear professional English.
6. Suitable for serious examination preparation.
7. Properly constructed as a multiple-choice question.
8. Free from ambiguity.
9. Free from grammatical errors.
10. Different from every other generated question.
11. Written so that there is ONE clearly correct answer.
12. Written with three plausible incorrect alternatives.

For Hard and Very Hard questions, the reasoning requirement must
be visibly greater than a basic recall question.

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
- repeated definition-only questions
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
DIFFICULTY INTEGRITY
==========================================================

The difficulty returned for each question must represent its
ACTUAL intellectual difficulty.

Never downgrade a Hard or Very Hard question merely to make it
easier.

Never upgrade an Easy or simple recall question merely by changing
its difficulty label.

For a requested single difficulty, every generated question should
match that requested difficulty.

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
      "answer": "Exact correct option text",
      "difficulty": "Medium"
    }
  ]
}

The difficulty value MUST be exactly one of:

"Easy"
"Medium"
"Hard"
"Very Hard"

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
      parsed?.questions,
      selectedDifficulty
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

