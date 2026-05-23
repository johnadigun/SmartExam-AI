const express = require("express");
const ProctorLog = require("../models/ProctorLog");

const router = express.Router();

/* LOG EVENTS */

router.post("/log", async (req, res) => {

  const { userId, event } = req.body;

  await ProctorLog.create({
    userId,
    event
  });

  res.json({ success: true });
});

/* GET REPORT */

router.get("/:userId", async (req, res) => {

  const logs = await ProctorLog.find({
    userId: req.params.userId
  });

  res.json(logs);
});

module.exports = router;