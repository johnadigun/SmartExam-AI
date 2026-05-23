const mongoose = require("mongoose");

const proctorSchema = new mongoose.Schema({

  userId: String,

  event: String,
  /* tab-switch
     face-not-detected (future AI upgrade)
     fullscreen-exit
     multiple-faces (future AI)
  */

  timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model("ProctorLog", proctorSchema);