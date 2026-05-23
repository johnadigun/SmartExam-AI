const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tenant", require("./routes/tenantRoutes"));
app.use("/api/exam", require("./routes/examRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/result", require("./routes/resultRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

/* ================= HEALTH ================= */

app.get("/", (req, res) => {
  res.send("🔥 CBT SaaS PLATFORM RUNNING");
});

/* ================= START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SaaS CBT RUNNING ON PORT ${PORT}`);
});