const nodemailer = require("nodemailer");

/* ================= EMAIL TRANSPORT ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= SEND EMAIL ================= */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"CBT System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("📧 Email sent to:", to);

  } catch (err) {
    console.log("Email error:", err.message);
  }
};

module.exports = sendEmail;