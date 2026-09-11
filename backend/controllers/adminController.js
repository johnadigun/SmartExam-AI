
const User = require("../models/user");
const bcrypt = require("bcrypt");

/* ============================================================
   ADMIN DASHBOARD
============================================================ */

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalAdmins = await User.countDocuments({
      role: {
        $in: ["super-admin", "school-admin"],
      },
    });

    const paidUsers = await User.countDocuments({
      cbtAccess: true,
    });

    return res.status(200).json({
      success: true,
      stats: {
        users: totalUsers,
        students: totalStudents,
        admins: totalAdmins,
        paidUsers,
        questions: 0,
        exams: 0,
        sessions: 0,
        activeSessions: 0,
      },
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   USERS
   STUDENTS ONLY
============================================================ */

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to load users.",
    });
  }
};

/* ============================================================
   UPDATE STUDENT
   ADMIN USERS MODULE
============================================================ */

exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      cbtAccess,
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
     * Users module is strictly for students.
     * Administrator accounts must be managed through
     * the Administrators module.
     */
    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message:
          "Administrator accounts must be managed through the Administrators module.",
      });
    }

    /* ==========================================
       EMAIL VALIDATION
    ========================================== */

    if (email !== undefined) {
      const normalizedEmail =
        String(email).trim().toLowerCase();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is required.",
        });
      }

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: {
          $ne: user._id,
        },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }

      user.email = normalizedEmail;
    }

    /* ==========================================
       BASIC DETAILS
    ========================================== */

    if (firstName !== undefined) {
      const value = String(firstName).trim();

      if (!value) {
        return res.status(400).json({
          success: false,
          message: "First name is required.",
        });
      }

      user.firstName = value;
    }

    if (middleName !== undefined) {
      user.middleName = String(middleName).trim();
    }

    if (lastName !== undefined) {
      const value = String(lastName).trim();

      if (!value) {
        return res.status(400).json({
          success: false,
          message: "Last name is required.",
        });
      }

      user.lastName = value;
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    /* ==========================================
       CBT ACCESS
    ========================================== */

    if (cbtAccess !== undefined) {
      user.cbtAccess = Boolean(cbtAccess);
    }

    /*
     * Never allow the Users module to change
     * the user's role.
     */
    user.role = "student";

    await user.save();

    const safeUser = user.toObject();

    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: safeUser,
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   TOGGLE STUDENT CBT ACCESS
============================================================ */

exports.toggleUserCbtAccess = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
     * Only students can be managed here.
     */
    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message:
          "CBT access for administrators cannot be changed from the Users module.",
      });
    }

    user.cbtAccess = !Boolean(user.cbtAccess);

    await user.save();

    const safeUser = user.toObject();

    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: user.cbtAccess
        ? "CBT access enabled successfully."
        : "CBT access disabled successfully.",
      user: safeUser,
    });
  } catch (err) {
    console.error(
      "TOGGLE USER CBT ACCESS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update CBT access.",
    });
  }
};

/* ============================================================
   DELETE STUDENT
============================================================ */

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    /*
     * Administrators must never be deleted through
     * the Users module.
     */
    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message:
          "Administrator accounts cannot be deleted from the Users module.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete user.",
    });
  }
};

/* ============================================================
   STUDENTS
============================================================ */

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      students,
    });
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   ADMINISTRATORS
   ONLY ADMINISTRATOR ROLES ARE RETURNED
============================================================ */

exports.getAdministrators = async (req, res) => {
  try {
    const administrators = await User.find({
      role: {
        $in: ["super-admin", "school-admin"],
      },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      administrators,
    });
  } catch (err) {
    console.error("GET ADMINISTRATORS ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   CREATE ADMINISTRATOR
============================================================ */

exports.createAdministrator = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      password,
      role,
      schoolId,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email, password and role are required.",
      });
    }

    if (
      !["super-admin", "school-admin"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid administrator role.",
      });
    }

    const existing = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const administrator = await User.create({
      firstName,
      middleName,
      lastName,
      phone,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role,
      schoolId: schoolId || null,

      isPaid: false,
      cbtAccess: false,
      cbtExpiry: null,
      remainingAttempts: 0,
      examTaken: false,
    });

    const safeAdministrator =
      administrator.toObject();

    delete safeAdministrator.password;

    return res.status(201).json({
      success: true,
      message: "Administrator created successfully.",
      administrator: safeAdministrator,
    });
  } catch (err) {
    console.error(
      "CREATE ADMINISTRATOR ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   RESET ADMINISTRATOR PASSWORD
============================================================ */

exports.resetAdministratorPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    const administrator = await User.findById(
      req.params.id
    );

    if (!administrator) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    if (
      !["super-admin", "school-admin"].includes(
        administrator.role
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected user is not an administrator.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    administrator.password = hashedPassword;

    await administrator.save();

    return res.json({
      success: true,
      message:
        "Administrator password reset successfully.",
    });
  } catch (err) {
    console.error(
      "RESET ADMINISTRATOR PASSWORD ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   UPDATE ADMINISTRATOR
============================================================ */

exports.updateAdministrator = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      role,
      schoolId,
    } = req.body;

    const administrator = await User.findById(
      req.params.id
    );

    if (!administrator) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    if (
      role &&
      !["super-admin", "school-admin"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid administrator role.",
      });
    }

    if (
      administrator.role !== "super-admin" &&
      administrator.role !== "school-admin"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected account is not an administrator.",
      });
    }

    if (email && email !== administrator.email) {
      const existingEmail = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: {
          $ne: administrator._id,
        },
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
    }

    administrator.firstName =
      firstName ?? administrator.firstName;

    administrator.middleName =
      middleName ?? administrator.middleName;

    administrator.lastName =
      lastName ?? administrator.lastName;

    administrator.phone =
      phone ?? administrator.phone;

    administrator.email =
      email !== undefined
        ? email.trim().toLowerCase()
        : administrator.email;

    administrator.role =
      role ?? administrator.role;

    administrator.schoolId =
      schoolId !== undefined
        ? schoolId
        : administrator.schoolId;

    await administrator.save();

    const safeAdministrator =
      administrator.toObject();

    delete safeAdministrator.password;

    return res.json({
      success: true,
      message: "Administrator updated successfully.",
      administrator: safeAdministrator,
    });
  } catch (err) {
    console.error(
      "UPDATE ADMINISTRATOR ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   DELETE ADMINISTRATOR
============================================================ */

exports.deleteAdministrator = async (req, res) => {
  try {
    const administrator = await User.findById(
      req.params.id
    );

    if (!administrator) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    if (administrator.role === "super-admin") {
      return res.status(403).json({
        success: false,
        message:
          "Super Administrator cannot be deleted.",
      });
    }

    if (
      !["super-admin", "school-admin"].includes(
        administrator.role
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected account is not an administrator.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message:
        "Administrator deleted successfully.",
    });
  } catch (err) {
    console.error(
      "DELETE ADMINISTRATOR ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ============================================================
   QUESTION BANK
============================================================ */

exports.getQuestions = async (req, res) => {
  return res.json({
    success: true,
    questions: [],
  });
};

/* ============================================================
   EXAMS
============================================================ */

exports.getExams = async (req, res) => {
  return res.json({
    success: true,
    exams: [],
  });
};

/* ============================================================
   RESULTS
============================================================ */

exports.getResults = async (req, res) => {
  return res.json({
    success: true,
    results: [],
  });
};

/* ============================================================
   LIVE SESSIONS
============================================================ */

exports.getLiveSessions = async (req, res) => {
  return res.json({
    success: true,
    sessions: [],
  });
};

/* ============================================================
   CHEATING REPORTS
============================================================ */

exports.getCheatingReports = async (req, res) => {
  try {
    const CbtSession = require("../models/CbtSession");

    const flagged = await CbtSession.find({
      tabSwitchCount: { $gte: 3 },
    })
      .populate(
        "userId",
        "firstName middleName lastName email"
      )
      .populate(
        "examId",
        "title name"
      )
      .sort({
        tabSwitchCount: -1,
        updatedAt: -1,
      });

    return res.status(200).json({
      success: true,
      flagged,
    });
  } catch (err) {
    console.error(
      "GET CHEATING REPORTS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load cheating reports.",
    });
  }
};