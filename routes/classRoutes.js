const express = require("express");
const {
  createClass,
  getAllClass,
  getClassById,
  getClassByUserId,
  addStudent,
  changeStudentStatus,
  removeStudentFromClass,
  getAllStudentInClass,
  getStats,
  getClassStatus,
} = require("../controllers/classController");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const classValidation = require("../middlewares/validations/class/classValidation");
const addStudentValidation = require("../middlewares/validations/class/addStudentValidation");

const router = express.Router();

// Guru membuat kelas
router.post(
  "/",
  authenticateToken,
  checkRole("guru"),
  classValidation,
  createClass
);

// Melihat semua kelas
router.get("/", getAllClass);

// Melihat semua kelas
router.get("/stats", authenticateToken, getStats);

// Melihat kelas berdasarkan id student
router.get("/my-class", authenticateToken, getClassByUserId);

// Melihat kelas berdasarkan id class
router.get("/:classId", getClassById);

// Guru menambahkan siswa ke kelas
router.post(
  "/add-student",
  authenticateToken,
  addStudentValidation,
  addStudent
);

// Guru mengubah status siswa
router.post(
  "/status-student",
  authenticateToken,
  checkRole("guru"),
  addStudentValidation,
  changeStudentStatus
);

// Guru menghapus siswa dari kelas
router.delete(
  "/remove-student",
  authenticateToken,
  checkRole("guru"),
  addStudentValidation,
  removeStudentFromClass
);

// Melihat status kelas
router.get("/:classId/status", authenticateToken, getClassStatus);

router.get("/students/:id", authenticateToken, getAllStudentInClass);

module.exports = router;
