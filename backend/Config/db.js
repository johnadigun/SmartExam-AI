const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected || mongoose.connection.readyState === 1) {
      console.log("⚡ MongoDB already connected (skip)");
      return;
    }

    console.log("Connecting MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;