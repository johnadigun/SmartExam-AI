const express = require("express");
const axios = require("axios");
const User = require("../models/User");

const router = express.Router();

/* INITIATE PAYMENT (₦500 CBT ACCESS) */

router.post("/initialize", async (req, res) => {

  const { email } = req.body;

  try {

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 50000, // ₦500 in kobo
        callback_url: "http://localhost:3000/payment-success"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    res.json({ success: false, message: "Payment init failed" });
  }

});

/* VERIFY PAYMENT */

router.get("/verify/:reference", async (req, res) => {

  try {

    const ref = req.params.reference;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const email = response.data.data.customer.email;

    await User.updateOne({ email }, { hasPaid: true });

    res.json({ success: true, message: "Payment confirmed" });

  } catch (err) {
    res.json({ success: false });
  }

});

module.exports = router;