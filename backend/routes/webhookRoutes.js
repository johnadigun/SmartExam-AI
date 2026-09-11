const express = require("express");
const router = express.Router();

const User = require("../models/user");

/* ================= PAYSTACK WEBHOOK ================= */
router.post("/paystack", async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {

      const email = event.data.customer.email;
      const reference = event.data.reference;

      await User.findOneAndUpdate(
        { email },
        {
          isPaid: true,
          paymentRef: reference
        }
      );

      console.log("✅ Webhook payment confirmed:", email);
    }

    res.sendStatus(200);

  } catch (err) {
    console.log("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

module.exports = router;