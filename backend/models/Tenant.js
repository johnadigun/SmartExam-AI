const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({

  name: String,
  ownerEmail: String,

  subscriptionActive: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model("Tenant", tenantSchema);