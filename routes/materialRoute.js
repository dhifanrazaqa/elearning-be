const express = require("express");
const {
  createMaterial,
  getMaterialById,
} = require("../controllers/materialController");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const materialValidation = require("../middlewares/validations/material/materialValidation");

const router = express.Router();

// Guru bisa menambahkan material
router.post(
  "/",
  authenticateToken,
  checkRole("guru"),
  materialValidation,
  createMaterial
);

// Guru bisa menambahkan material
router.get("/:materialId", authenticateToken, getMaterialById);

module.exports = router;
