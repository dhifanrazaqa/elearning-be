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

router.get("/students/:id", authenticateToken, getAllStudentInClass);

module.exports = router;
