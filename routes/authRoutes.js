const express = require("express");
const { register, login } = require("../controllers/authController");
const loginValidation = require("../middlewares/validations/auth/loginValidation");
const registerValidation = require("../middlewares/validations/auth/registerValidation");

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

module.exports = router;
