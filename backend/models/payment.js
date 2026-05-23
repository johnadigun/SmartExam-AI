const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  email: String,
  reference: String,
  paid: Boolean

});

module.exports = mongoose.model("Payment", paymentSchema);