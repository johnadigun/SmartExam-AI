const User = require("../models/user");

const runExpiryCheck = async () => {
  try {
    const now = new Date();

    // 1. Find expired active users
    const expiredUsers = await User.find({
      isPaid: true,
      expiryTime: { $lte: now },
    }).select("_id name email expiryTime");

    if (expiredUsers.length > 0) {
      console.log(`⏳ Expiry Job: ${expiredUsers.length} users expired`);

      expiredUsers.forEach((u) => {
        console.log(`❌ Expired: ${u.email} | ${u.expiryTime}`);
      });
    }

    // 2. Bulk update (lock access)
    const result = await User.updateMany(
      {
        isPaid: true,
        expiryTime: { $lte: now },
      },
      {
        $set: {
          isPaid: false,
        },
      }
    );

    // 3. Optional admin insight
    if (result.modifiedCount > 0) {
      console.log(`🔒 Locked accounts: ${result.modifiedCount}`);
    }
  } catch (err) {
    console.log("❌ EXPIRY JOB ERROR:", err.message);
  }
};

module.exports = runExpiryCheck;