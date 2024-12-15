const express = require("express");
const {
  createQuiz,
  getAllQuizzesByContent,
  getQuizById,
  createAnswer,
  createQuestion,
  createAttempt,
  answerQuestion,
  getFinalScore,
  createQuizWithQuestions,
  getAnswers,
} = require("../controllers/quizController");
const authenticateToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const quizValidation = require("../middlewares/validations/quiz/quizValidation");
const answerValidation = require("../middlewares/validations/quiz/answerValidation");
const questionValidation = require("../middlewares/validations/quiz/questionValidation");
const attemptValidation = require("../middlewares/validations/quiz/attemptValidation");
const answeringValidation = require("../middlewares/validations/quiz/answeringValidation");
const finalAnswerValidation = require("../middlewares/validations/quiz/finalAnswerValidation");

const router = express.Router();

// Guru bisa menambahkan quiz
router.post(
  "/",
  authenticateToken,
  checkRole("guru"),
  quizValidation,
  createQuizWithQuestions
);

// Guru bisa mendapatkan quiz berdasarkan content
router.get("/:contentId", authenticateToken, getAllQuizzesByContent);

// Guru bisa mendapatkan quiz berdasarkan id
router.get("/quiz/:id", authenticateToken, getQuizById);

// Guru bisa menambahkan jawaban quiz
router.post(
  "/quiz/answer",
  authenticateToken,
  checkRole("guru"),
  answerValidation,
  createAnswer
);

// Guru bisa menambahkan pertanyaan quiz
router.post(
  "/quiz/question",
  authenticateToken,
  checkRole("guru"),
  questionValidation,
  createQuestion
);

// Siswa bisa menambahkan attempt quiz
router.post(
  "/quiz/attempt",
  authenticateToken,
  checkRole("siswa"),
  attemptValidation,
  createAttempt
);

// Siswa bisa menambahkan jawabannya
router.post(
  "/quiz/attempt/answer",
  authenticateToken,
  checkRole("siswa"),
  answeringValidation,
  answerQuestion
);

// Siswa bisa mendapatkan jawabannya
router.get(
  "/quiz/attempt/:quizId",
  authenticateToken,
  checkRole("siswa"),
  getAnswers
);

// Siswa bisa mendapatkan nilai
router.post(
  "/quiz/attempt/submit/",
  authenticateToken,
  checkRole("siswa"),
  finalAnswerValidation,
  getFinalScore
);

module.exports = router;
