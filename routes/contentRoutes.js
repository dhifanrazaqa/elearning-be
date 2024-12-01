const express = require("express");
const {
  createContent,
  getClassContents,
  getClassContent,
  deleteClassContent,
} = require("../controllers/contentController");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const contentValidation = require("../middlewares/validations/content/contentValidation");
const deleteContentValidation = require("../middlewares/validations/content/deleteContentValidation");

const router = express.Router();

// Guru bisa menambahkan konten
router.post(
  "/",
  authenticateToken,
  checkRole("guru"),
  contentValidation,
  createContent
);

// Semua pengguna bisa melihat konten
router.get("/:classId", authenticateToken, getClassContents);

// Siswa bisa melihat detail konten
router.get(
  "/:classId/:contentId",
  authenticateToken,
  checkRole("siswa"),
  getClassContent
);

// Semua pengguna bisa melihat konten
router.delete(
  "/:classId",
  authenticateToken,
  checkRole("guru"),
  deleteContentValidation,
  deleteClassContent
);

module.exports = router;
