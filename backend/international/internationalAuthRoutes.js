
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dns = require("node:dns");

/* ========================================================
   INTERNATIONAL DNS CONFIGURATION

   Use public DNS resolvers because the default Node.js
   resolver is returning ECONNREFUSED for the MongoDB SRV
   record on this computer.
======================================================== */

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (error) {
  console.error(
    "International DNS configuration error:",
    error.message
  );
}

/* ========================================================
   INTERNATIONAL CANDIDATE MODEL

   This model uses its own MongoDB connection. It does not
   use the Local CBT candidate database connection.
======================================================== */

const getInternationalCandidateModel = require(
  "../models/internationalCandidate"
);

const router = express.Router();

let internationalConnection = null;
let internationalConnectionPromise = null;

/* ========================================================
   JWT SECRET
======================================================== */

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

/* ========================================================
   INTERNATIONAL DATABASE CONNECTION
======================================================== */

function getCandidateModel() {
  const mongoUri = process.env.INTERNATIONAL_MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "INTERNATIONAL_MONGO_URI is not configured."
    );
  }

  if (!internationalConnection) {
    internationalConnection = mongoose.createConnection(
      mongoUri,
      {
        serverSelectionTimeoutMS: 15000,
      }
    );

    internationalConnection.on("error", (error) => {
      console.error(
        "International MongoDB connection error:",
        error.message
      );
    });

    internationalConnection.on("connected", () => {
      console.log(
        "International MongoDB connected successfully."
      );
    });
  }

  return getInternationalCandidateModel(
    internationalConnection
  );
}

async function waitForInternationalDatabase() {
  const Candidate = getCandidateModel();

  if (!internationalConnectionPromise) {
    internationalConnectionPromise = Candidate.db
      .asPromise()
      .catch((error) => {
        internationalConnectionPromise = null;
        throw error;
      });
  }

  await internationalConnectionPromise;

  return Candidate;
}

/* ========================================================
   SAFE CANDIDATE RESPONSE

   Never return the password or password hash.
======================================================== */

function safeCandidate(candidate) {
  return {
    id: candidate._id,
    firstName: candidate.firstName,
    middleName: candidate.middleName,
    lastName: candidate.lastName,
    phone: candidate.phone,
    email: candidate.email,
    role: candidate.role,
  };
}

/* ========================================================
   INTERNATIONAL CANDIDATE REGISTRATION
   POST /api/international/auth/register
======================================================== */

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      middleName = "",
      lastName,
      phone = "",
      email,
      password,
    } = req.body || {};

    if (
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    const Candidate = await waitForInternationalDatabase();

    const normalizedEmail = email.trim().toLowerCase();

    const existingCandidate = await Candidate.findOne({
      email: normalizedEmail,
    });

    if (existingCandidate) {
      return res.status(409).json({
        success: false,
        message:
          "An International candidate account already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const candidate = await Candidate.create({
      firstName: firstName.trim(),
      middleName:
        typeof middleName === "string"
          ? middleName.trim()
          : "",
      lastName: lastName.trim(),
      phone:
        typeof phone === "string"
          ? phone.trim()
          : "",
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    return res.status(201).json({
      success: true,
      message: "International registration successful.",
      user: safeCandidate(candidate),
    });
  } catch (error) {
    console.error(
      "International registration error:",
      error.message
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An International candidate account already exists with this email.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "International registration failed. Please try again.",
    });
  }
});

/* ========================================================
   INTERNATIONAL CANDIDATE LOGIN
   POST /api/international/auth/login
======================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const Candidate = await waitForInternationalDatabase();

    const candidate = await Candidate.findOne({
      email: email.trim().toLowerCase(),
    });

    if (
      !candidate ||
      typeof candidate.password !== "string" ||
      !(await bcrypt.compare(password, candidate.password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: candidate._id.toString(),
        role: "student",
        platform: "international",
      },
      getJwtSecret(),
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
      user: safeCandidate(candidate),
    });
  } catch (error) {
    console.error(
      "International login error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "International login failed. Please try again.",
    });
  }
});

/* ========================================================
   EXPORT ROUTER
======================================================== */

module.exports = router;
