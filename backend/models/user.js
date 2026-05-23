const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,
  middleName: String,
  surname: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "student" },
  hasPaid: { type: Boolean, default: false }

});

module.exports = mongoose.model("User", userSchema);