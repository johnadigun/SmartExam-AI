const express = require("express");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

/* LOG EVENT */

router.post("/log", async (req, res) => {
  const { userId, event } = req.body;

  await ActivityLog.create({ userId, event });

  res.json({ success: true });
});

/* GET ANALYTICS */

router.get("/:userId", async (req, res) => {

  const logs = await ActivityLog.find({
    userId: req.params.userId
  });

  res.json(logs);
});

module.exports = router;