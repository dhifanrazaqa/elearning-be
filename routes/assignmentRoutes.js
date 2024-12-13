const express = require("express");
const {
  createAssignment,
  getAllSubmissionByAssignment,
  submitAssignment,
  gradeAssignment,
} = require("../controllers/assignmentController");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const assignmentValidation = require("../middlewares/validations/assignment/assignmentValidation");
const submissionValidation = require("../middlewares/validations/assignment/submissionValidation");
const gradingValidation = require("../middlewares/validations/assignment/gradingValidation");

const router = express.Router();

// Guru bisa membuat penugasan
router.post(
  "/",
  authenticateToken,
  checkRole("guru"),
  assignmentValidation,
  createAssignment
);

// Guru bisa melihat submission dari asssignment
router.get(
  "/class/:classId/assignment/:assignmentId/submissions",
  authenticateToken,
  checkRole("guru"),
  getAllSubmissionByAssignment
);

// Siswa bisa mengumpulkan tugas
router.post(
  "/submit",
  authenticateToken,
  checkRole("siswa"),
  submissionValidation,
  submitAssignment
);

// Guru bisa memberikan nilai tugas
router.post(
  "/grade",
  authenticateToken,
  checkRole("guru"),
  gradingValidation,
  gradeAssignment
);

module.exports = router;
