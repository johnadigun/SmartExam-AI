require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/user");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const email = "admin@cbtsystem.com";
    const plainPassword = "Admin12345";

    // Delete any existing admin with this email
    await User.deleteOne({ email });

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create fresh Super Admin
    const admin = await User.create({
      firstName: "System",
      middleName: "",
      lastName: "Administrator",
      phone: "",
      email,
      password: hashedPassword,
      role: "super-admin",
      schoolId: null,
      isPaid: true,
      cbtAccess: true,
      cbtExpiry: null,
      remainingAttempts: 9999,
      examTaken: false,
      certificateIssued: false,
      score: 0,
      grade: "",
    });

    console.log("");
    console.log("========================================");
    console.log("SUPER ADMIN CREATED SUCCESSFULLY");
    console.log("========================================");
    console.log("Email    :", email);
    console.log("Password :", plainPassword);
    console.log("Role     :", admin.role);
    console.log("========================================");

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();