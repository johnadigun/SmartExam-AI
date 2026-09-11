require("dotenv").config();

const mongoose = require("mongoose");

console.log("Testing MongoDB connection...");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(
      "Database:",
      mongoose.connection.db.databaseName
    );
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ Connection Failed");
    console.log(err.message);
    process.exit(1);
  });