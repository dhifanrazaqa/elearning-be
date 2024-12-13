const ClientError = require("../errors/clientError");
const prisma = require("../prismaClient");

const createQuiz = async (req, res, next) => {
  const { title, description, duration, contentId } = req.body;
  try {
    const contentData = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!contentData) throw new ClientError("Invalid content");

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        contentId,
        duration,
        teacherId: req.user.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Quiz created successfully", data: quiz });
  } catch (error) {
    return next(error);
  }
};

const getAllQuizzesByContent = async (req, res, next) => {
  const { contentId } = req.params;
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        contentId,
      },
    });
    return res
      .status(200)
      .json({ message: "Quizzes retrieved successfully", data: quizzes });
  } catch (error) {
    return next(error);
  }
};

const getQuizById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        Question: {
          include: {
            Answer: true,
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Quiz retrieved successfully", data: quiz });
  } catch (error) {
    return next(error);
  }
};

const createQuestion = async (req, res, next) => {
  const { text, quizId } = req.body;
  try {
    const quizData = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quizData) throw new ClientError("Invalid quiz");

    const question = await prisma.question.create({
      data: { text, quizId },
    });
    return res
      .status(201)
      .json({ message: "Question created successfully", data: question });
  } catch (error) {
    return next(error);
  }
};

const createAnswer = async (req, res, next) => {
  const { text, isCorrect, questionId } = req.body;
  try {
    const questionData = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!questionData) throw new ClientError("Invalid question");

    const answer = await prisma.answer.create({
      data: { text, isCorrect, questionId },
    });
    return res
      .status(201)
      .json({ message: "Answer created successfully", data: answer });
  } catch (error) {
    return next(error);
  }
};

const createAttempt = async (req, res, next) => {
  const { quizId, classId } = req.body;
  console.log(classId);
  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) throw new ClientError("Invalid class");

    const quizData = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quizData) throw new ClientError("Invalid quiz");

    const attempt = await prisma.attempt.create({
      data: { quizId, classId, userId: req.user.id },
    });
    return res
      .status(201)
      .json({ message: "Attempt created successfully", data: attempt });
  } catch (error) {
    return next(error);
  }
};

const answerQuestion = async (req, res, next) => {
  const { attemptId, answerId } = req.body;

  try {
    const attemptData = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attemptData) throw new ClientError("Invalid attempt");

    const attemptAnswer = await prisma.attemptAnswer.create({
      data: { attemptId, answerId },
    });
    return res.status(201).json({message: "Answering successfully", data: attemptAnswer});
  } catch (error) {
    return next(error);
  }
};

const getFinalScore = async (req, res, next) => {
  const { attemptId } = req.params;

  try {
    const attemptData = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attemptData) throw new ClientError("Invalid attempt");

    const answers = await prisma.attemptAnswer.findMany({
      where: { attemptId },
      include: { answer: true },
    });
    let score = 0;
    answers.forEach((answer) => {
      if (answer.answer.isCorrect) {
        score += 1;
      }
    });
    const updatedAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: { score },
    });
    return res.status(200).json({ correct: updatedAttempt.score });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createQuiz,
  getAllQuizzesByContent,
  getQuizById,
  createQuestion,
  createAnswer,
  createAttempt,
  answerQuestion,
  getFinalScore,
};
