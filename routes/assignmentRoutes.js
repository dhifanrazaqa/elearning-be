const express = require("express");
const {
  createAssignment,
  submitAssignment,
  gradeAssignment,
} = require("../controllers/assignmentController");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// Guru bisa membuat penugasan
router.post("/", authenticateToken, checkRole("guru"), createAssignment);

// Siswa bisa mengumpulkan tugas
router.post("/submit", authenticateToken, checkRole("siswa"), submitAssignment);

// Guru bisa memberikan nilai tugas
router.patch("/grade", authenticateToken, checkRole("guru"), gradeAssignment);

module.exports = router;
