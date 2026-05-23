const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({

  userId: String,

  event: String, 
  /* 
    tab-switch
    fullscreen-exit
    copy-paste
    refresh
  */

  timestamp: Date

});

module.exports = mongoose.model("ActivityLog", logSchema);