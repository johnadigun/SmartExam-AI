const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

/* ================= IMPORT ROUTES ================= */

const examRoutes = require("./routes/examRoutes");
const aiExamRoutes = require("./routes/aiExamRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const questionManagerRoutes = require("./routes/questionManagerRoutes");
const questionBankRoutes = require("./routes/questionBankRoutes");
const userRoutes = require("./routes/userRoutes");
const bulkUploadRoutes = require("./routes/bulkUploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiQuestionRoutes = require("./routes/aiQuestionRoutes");

/* ==========================================================
   INTERNATIONAL EXAMINATION ROUTES
========================================================== */

const internationalPaymentRoutes =
  require("./international/internationalPaymentRoutes");

const internationalExamRoutes =
  require("./international/internationalExams");

const internationalAttemptRoutes =
  require("./international/internationalAttemptRoutes");

const internationalQuestionRoutes =
  require("./international/internationalQuestions");

const internationalAuthRoutes =
  require("./international/internationalAuthRoutes");

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= LOCAL CBT ROUTES ================= */

app.use("/api/exams", examRoutes);
app.use("/api/ai-exam", aiExamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/results", resultRoutes);

app.use("/api/questions", questionManagerRoutes);
app.use("/api/question-bank", questionBankRoutes);
app.use("/api/ai", aiQuestionRoutes);

app.use("/api/users", userRoutes);
app.use("/api/bulk-upload", bulkUploadRoutes);
app.use("/api/admin", adminRoutes);

/* ==========================================================
   INTERNATIONAL PAYMENT API

   Mount payments first so payment verification can be
   handled before other International routers.
   The verification route itself must independently verify
   the transaction with Paystack before activating access.
========================================================== */

app.use(
  "/api/international",
  internationalPaymentRoutes
);

/* ==========================================================
   REMAINING INTERNATIONAL EXAMINATION APIs
========================================================== */

app.use(
  "/api/international",
  internationalExamRoutes
);

app.use(
  "/api/international",
  internationalAttemptRoutes
);

app.use(
  "/api/international",
  internationalQuestionRoutes
);

app.use(
  "/api/international/auth",
  internationalAuthRoutes
);

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(
      "MongoDB Connection Error:",
      err.message
    );
  });

mongoose.connection.on("connected", () => {
  console.log("Database Status: CONNECTED");
  console.log(
    "Current Database:",
    mongoose.connection.db.databaseName
  );
});

mongoose.connection.on("error", (err) => {
  console.log(
    "Database Status ERROR:",
    err.message
  );
});

/* ================= HOME ================= */

app.get("/", (req, res) => {
  res.send("CBT Backend Running...");
});

/* ================= TEST QUESTIONS ================= */

app.get("/test-questions", async (req, res) => {
  try {
    const Question = require("./models/question");

    const count =
      await Question.countDocuments();

    res.json({
      database:
        mongoose.connection.db.databaseName,
      collection:
        Question.collection.name,
      count,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});