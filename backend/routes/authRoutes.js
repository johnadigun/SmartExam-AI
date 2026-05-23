const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

/* ================= JWT TOKEN GENERATOR ================= */

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

/* ================= REGISTER USER ================= */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      middleName,
      surname,
      phone,
      email,
      password
    } = req.body;

    /* CHECK IF USER EXISTS */
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    /* HASH PASSWORD */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* CREATE USER */
    const user = await User.create({
      name,
      middleName,
      surname,
      phone,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
});

/* ================= LOGIN USER ================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    /* FIND USER */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    /* COMPARE PASSWORD */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    /* RETURN TOKEN */
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      hasPaid: user.hasPaid,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
});

/* ================= GET USER PROFILE (PROTECTED EXAMPLE) ================= */

router.get("/profile", async (req, res) => {
  res.json({
    message: "Profile route ready (add auth middleware next step)"
  });
});

module.exports = router;