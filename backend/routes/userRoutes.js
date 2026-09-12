const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const User = require("../models/user");

/* ==========================================================
   GET ALL USERS
========================================================== */

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: users.length,
      users,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* ==========================================================
   GET SINGLE USER
========================================================== */

router.get("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID.",
      });
    }

    const user = await User.findById(id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

/* ==========================================================
   SEARCH USERS
========================================================== */

router.get("/search/:keyword", async (req, res) => {

  try {

    const keyword = req.params.keyword;

    const users = await User.find({
      $or: [
        {
          fullName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    }).select("-password");

    return res.json({
      success: true,
      total: users.length,
      users,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});
/* ==========================================================
   UPDATE USER
========================================================== */

router.put("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const {
      firstName,
      lastName,
      email,
      role,
      cbtAccess,
      schoolId,
    } = req.body;

    if (firstName !== undefined)
      user.firstName = firstName;

    if (lastName !== undefined)
      user.lastName = lastName;

    if (email !== undefined)
      user.email = email;

    if (role !== undefined)
      user.role = role;

    if (cbtAccess !== undefined)
      user.cbtAccess = cbtAccess;

    if (schoolId !== undefined)
      user.schoolId = schoolId;

    await user.save();

    return res.json({
      success: true,
      message: "User updated successfully.",
      user,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});


/* ==========================================================
   TOGGLE CBT ACCESS
========================================================== */

router.patch("/:id/cbt-access", async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.cbtAccess = !user.cbtAccess;

    await user.save();

    return res.json({
      success: true,
      message: "CBT access updated successfully.",
      cbtAccess: user.cbtAccess,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});


/* ==========================================================
   DELETE USER
========================================================== */

router.delete("/:id", async (req, res) => {

  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "User deleted successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});


/* ==========================================================
   EXPORT
========================================================== */

module.exports = router;
