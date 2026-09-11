
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");


/* ==========================================================
   JWT SECRET
========================================================== */

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return secret;
};


/* ==========================================================
   REGISTER
========================================================== */

router.post("/register", async (req, res) => {
  try {

    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      password,
      schoolId,
    } = req.body;


    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and password are required.",
      });
    }


    const normalizedEmail =
      email.trim().toLowerCase();


    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });


    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email already exists",
      });
    }


    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    const newUser =
      await User.create({

        firstName,

        middleName,

        lastName,

        phone,

        email:
          normalizedEmail,

        password:
          hashedPassword,

        schoolId:
          schoolId || null,

        role:
          "student",

        isPaid:
          false,

        cbtAccess:
          false,

        cbtExpiry:
          null,

        remainingAttempts:
          0,

        examTaken:
          false,

        certificateIssued:
          false,

        score:
          0,

        grade:
          "",

      });


    const safeUser =
      newUser.toObject();


    delete safeUser.password;


    return res.status(201).json({

      success:
        true,

      message:
        "Registration successful",

      user:
        safeUser,

    });

  } catch (err) {

    console.error(
      "REGISTER ERROR:",
      err
    );

    return res.status(500).json({

      success:
        false,

      message:
        "Registration failed.",

    });

  }
});


/* ==========================================================
   LOGIN
========================================================== */

router.post("/login", async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    if (!email || !password) {
      return res.status(400).json({

        success:
          false,

        message:
          "Email and password are required.",

      });
    }


    const foundUser =
      await User.findOne({

        email:
          email.trim().toLowerCase(),

      });


    if (!foundUser) {
      return res.status(401).json({

        success:
          false,

        message:
          "Invalid credentials",

      });
    }


    const validPassword =
      await bcrypt.compare(
        password,
        foundUser.password
      );


    if (!validPassword) {
      return res.status(401).json({

        success:
          false,

        message:
          "Invalid credentials",

      });
    }


    const token =
      jwt.sign(

        {
          id:
            foundUser._id,

          role:
            foundUser.role,
        },

        getJwtSecret(),

        {
          expiresIn:
            "7d",
        }

      );


    const safeUser =
      foundUser.toObject();


    delete safeUser.password;


    return res.json({

      success:
        true,

      token,

      user:
        safeUser,

    });

  } catch (err) {

    console.error(
      "LOGIN ERROR:",
      err
    );

    return res.status(500).json({

      success:
        false,

      message:
        "Login failed.",

    });

  }
});


/* ==========================================================
   CURRENT USER
   GET /auth/me
========================================================== */

router.get("/me", async (req, res) => {
  try {

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {
      return res.status(401).json({

        success:
          false,

        message:
          "No token provided",

      });
    }


    const parts =
      authHeader.split(" ");


    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({

        success:
          false,

        message:
          "Invalid authorization format",

      });
    }


    const token =
      parts[1];


    const decoded =
      jwt.verify(
        token,
        getJwtSecret()
      );


    const user =
      await User.findById(
        decoded.id
      );


    if (!user) {
      return res.status(404).json({

        success:
          false,

        message:
          "User not found",

      });
    }


    return res.json({

      success:
        true,

      user: {

        _id:
          user._id,

        firstName:
          user.firstName,

        middleName:
          user.middleName,

        lastName:
          user.lastName,

        phone:
          user.phone,

        email:
          user.email,

        role:
          user.role,

        schoolId:
          user.schoolId,

        isPaid:
          user.isPaid,

        cbtAccess:
          user.cbtAccess,

        cbtExpiry:
          user.cbtExpiry,

        remainingAttempts:
          user.remainingAttempts,

        examTaken:
          user.examTaken,

        certificateIssued:
          user.certificateIssued,

        score:
          user.score,

        grade:
          user.grade,

      },

    });

  } catch (err) {

    console.error(
      "AUTH ME ERROR:",
      err
    );

    return res.status(401).json({

      success:
        false,

      message:
        "Invalid or expired token",

    });

  }
});


module.exports = router;

