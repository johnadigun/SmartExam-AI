
const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");
const superAdminOnly = require("../middleware/superAdminOnly");

console.log(
  "deleteAdministrator =",
  adminController.deleteAdministrator
);

console.log(
  "updateAdministrator =",
  adminController.updateAdministrator
);

console.log(
  "createAdministrator =",
  adminController.createAdministrator
);

console.log(
  "getAdministrators =",
  adminController.getAdministrators
);

/*
==================================================
ADMIN DASHBOARD
GET: /api/admin/dashboard
==================================================
*/

router.get(
  "/dashboard",
  adminAuth,
  adminController.getDashboard
);

/*
==================================================
USERS
STUDENTS ONLY
==================================================
*/

/*
GET ALL STUDENTS
GET /api/admin/users
*/

router.get(
  "/users",
  adminAuth,
  adminController.getUsers
);

/*
UPDATE STUDENT
PUT /api/admin/users/:id
*/

router.put(
  "/users/:id",
  adminAuth,
  adminController.updateUser
);

/*
TOGGLE CBT ACCESS
PATCH /api/admin/users/:id/cbt-access
*/

router.patch(
  "/users/:id/cbt-access",
  adminAuth,
  adminController.toggleUserCbtAccess
);

/*
DELETE STUDENT
DELETE /api/admin/users/:id
*/

router.delete(
  "/users/:id",
  adminAuth,
  adminController.deleteUser
);

/*
==================================================
ADMINISTRATORS
SUPER ADMIN ONLY
==================================================
*/

router.get(
  "/administrators",
  adminAuth,
  superAdminOnly,
  adminController.getAdministrators
);

router.post(
  "/administrators",
  adminAuth,
  superAdminOnly,
  adminController.createAdministrator
);

router.put(
  "/administrators/:id/password",
  adminAuth,
  superAdminOnly,
  adminController.resetAdministratorPassword
);

router.put(
  "/administrators/:id",
  adminAuth,
  superAdminOnly,
  adminController.updateAdministrator
);

router.delete(
  "/administrators/:id",
  adminAuth,
  superAdminOnly,
  adminController.deleteAdministrator
);

/*
==================================================
STUDENTS
==================================================
*/

router.get(
  "/students",
  adminAuth,
  adminController.getStudents
);

/*
==================================================
QUESTION BANK
==================================================
*/

router.get(
  "/questions",
  adminAuth,
  adminController.getQuestions
);

/*
==================================================
EXAMS
==================================================
*/

router.get(
  "/exams",
  adminAuth,
  adminController.getExams
);

/*
==================================================
RESULTS
==================================================
*/

router.get(
  "/results",
  adminAuth,
  adminController.getResults
);

/*
==================================================
LIVE MONITORING
==================================================
*/

router.get(
  "/live",
  adminAuth,
  adminController.getLiveSessions
);

/*
==================================================
CHEATING REPORTS
==================================================
*/

router.get(
  "/cheating",
  adminAuth,
  adminController.getCheatingReports
);

module.exports = router;