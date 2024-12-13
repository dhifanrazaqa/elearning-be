const express = require("express");
const {
  createForumPost,
  getAllForumPostByClass,
  createForumReply,
} = require("../controllers/forumController");
const authenticateToken = require("../middlewares/authMiddleware");
const forumPostValidation = require("../middlewares/validations/forum/forumPostValidation");
const forumReplyValidation = require("../middlewares/validations/forum/forumReplyValidation");

const router = express.Router();

// Guru dan siswa bisa menambahkan post forum
router.post("/", authenticateToken, forumPostValidation, createForumPost);

// Guru dan siswa bisa melihat forum
router.get("/:id", authenticateToken, getAllForumPostByClass);

// Guru dan siswa bisa menambahkan forum reply
router.post(
  "/reply",
  authenticateToken,
  forumReplyValidation,
  createForumReply
);

module.exports = router;
