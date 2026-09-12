
const express = require("express");
const router = express.Router();

const Payment = require("../models/payment");
const User = require("../models/user");

// ==========================================================
// PAYSTACK WEBHOOK
// ==========================================================

router.post("/paystack", async (req, res) => {
  try {
    const event = req.body;

    // Paystack sends "charge.success"
    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    const reference = event.data?.reference;

    if (!reference) {
      return res.sendStatus(200);
    }

    // ======================================================
    // FIND PAYMENT
    // ======================================================

    const payment = await Payment.findOne({
      reference,
    });

    /*
      If the payment was not created in our system,
      acknowledge the webhook but do nothing.
    */

    if (!payment) {
      return res.sendStatus(200);
    }

    // ======================================================
    // PREVENT DUPLICATE PROCESSING
    // ======================================================

    if (payment.status === "success") {
      return res.sendStatus(200);
    }

    // ======================================================
    // MARK PAYMENT SUCCESSFUL
    // ======================================================

    payment.status = "success";

    await payment.save();

    // ======================================================
    // CREATE 5-HOUR CBT ACCESS
    // ======================================================

    const now = new Date();

    const expiryTime = new Date(
      now.getTime() + 5 * 60 * 60 * 1000
    );

    // ======================================================
    // UNLOCK CBT
    // ======================================================

    const user = await User.findById(payment.userId);

    if (!user) {
      console.error(
        "WEBHOOK USER NOT FOUND:",
        payment.userId
      );

      return res.sendStatus(200);
    }

    user.isPaid = true;

    user.cbtAccess = true;

    user.cbtExpiry = expiryTime;

    user.remainingAttempts = 1;

    user.examTaken = false;

    user.currentExamId = null;

    await user.save();

    console.log(
      "CBT UNLOCKED VIA WEBHOOK:",
      payment.userId
    );

    console.log(
      "CBT EXPIRY:",
      expiryTime.toISOString()
    );

    return res.sendStatus(200);

  } catch (err) {

    console.error(
      "WEBHOOK ERROR:",
      err.message
    );

    return res.sendStatus(500);
  }
});

module.exports = router;
