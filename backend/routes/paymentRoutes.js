const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("../models/user");
const Payment = require("../models/payment");

/* ==========================================================
   INITIALIZE PAYMENT
========================================================== */

router.post("/initialize", async (req, res) => {

  try {

    const { email, amount, userId } = req.body;

    if (!email || !amount || !userId) {

      return res.status(400).json({
        success: false,
        message: "Missing payment information",
      });

    }

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    const paystackResponse = await axios.post(

      "https://api.paystack.co/transaction/initialize",

      {
        email,
        amount: amount * 100,

        callback_url:
          "http://localhost:3000/verify",

      },

      {

        headers: {

          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type": "application/json",

        },

      }

    );

    return res.json({

      success: true,

      authorization_url:
        paystackResponse.data.data.authorization_url,

      reference:
        paystackResponse.data.data.reference,

    });

  } catch (err) {

    console.log("PAYMENT INITIALIZE ERROR");
    console.log(err.message);

    return res.status(500).json({

      success: false,

      message: "Unable to initialize payment",

    });

  }

});

/* ==========================================================
   VERIFY PAYMENT
========================================================== */

router.get("/verify/:reference", async (req, res) => {

  try {

    const { reference } = req.params;

    const verifyResponse = await axios.get(

      `https://api.paystack.co/transaction/verify/${reference}`,

      {

        headers: {

          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

        },

      }

    );

    const paymentData = verifyResponse.data.data;

    if (!paymentData || paymentData.status !== "success") {

      return res.json({

        success: false,

        message: "Payment was not successful",

      });

    }

    /* ======================================================
       ALREADY VERIFIED?
    ====================================================== */

    const existingPayment = await Payment.findOne({
      reference,
    });

    if (existingPayment) {

      const existingUser = await User.findOne({
        email: paymentData.customer.email,
      });

      return res.json({

        success: true,

        message: "Payment already verified",

        expiryTime:
          existingUser?.cbtExpiry || null,

        user: existingUser,

      });

    }

    /* ======================================================
       FIND USER
    ====================================================== */

    const email = paymentData.customer.email;

    const now = new Date();

    const expiryTime = new Date(
      now.getTime() + (5 * 60 * 60 * 1000)
    );

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({

        success: false,

        message: "User not found",

      });

    }

    /* ======================================================
       CREATE A BRAND NEW CBT SESSION
    ====================================================== */

    user.isPaid = true;

    user.cbtAccess = true;

    user.cbtExpiry = expiryTime;

    user.remainingAttempts = 1;

    user.examTaken = false;

    user.currentExamId = null;

    await user.save();

    /* ======================================================
       SAVE PAYMENT
    ====================================================== */

    await Payment.create({

      userId: user._id,

      email: user.email,

      amount: paymentData.amount / 100,

      reference,

      status: "success",

      purpose: "cbt_access",

      paidAt: now,

    });

    /* ======================================================
       SUCCESS
    ====================================================== */

    return res.json({

      success: true,

      message: "Payment verified successfully",

      expiryTime,

      user,

    });

  } catch (err) {

    console.log("VERIFY PAYMENT ERROR");

    console.log(err.message);

    return res.status(500).json({

      success: false,

      message: "Payment verification failed",

    });

  }

});

/* ==========================================================
   EXPORT
========================================================== */

module.exports = router;