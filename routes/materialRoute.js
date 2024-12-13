const express = require("express");
const { createMaterial } = require("../controllers/materialController");
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

module.exports = router;
