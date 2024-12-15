const ClientError = require("../errors/clientError");
const prisma = require("../prismaClient");

const createQuizWithQuestions = async (req, res, next) => {
  const { title, description, duration, contentId, questions } = req.body;

  try {
    // Validasi contentId
    const contentData = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!contentData) throw new ClientError("Invalid content");

    // Membuat quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        contentId,
        duration,
        teacherId: req.user.id,
      },
    });

    // Membuat pertanyaan dan jawaban terkait
    for (const question of questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          text: question.question,
          quizId: quiz.id,
        },
      });

      for (let i = 0; i < question.options.length; i++) {
        await prisma.answer.create({
          data: {
            text: question.options[i].text,
            isCorrect: i === question.correctOption,
            questionId: createdQuestion.id,
          },
        });
      }
    }

    return res
      .status(201)
      .json({ message: "Quiz created successfully", data: quiz });
  } catch (error) {
    return next(error);
  }
};

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
            Answer: {
              select: {
                id: true,
                text: true,
              },
            },
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

const createAttempt = async (req, res, next) => {
  const { quizId, classId } = req.body;

  try {
    const isAlreadyCreated = await prisma.attempt.findFirst({
      where: {
        quizId,
        classId,
        userId: req.user.id,
      },
    });

    if (isAlreadyCreated) {
      return res
        .status(200)
        .json({ message: "Attempt already created", data: isAlreadyCreated });
    }

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
  const { attemptId, answerId, questionId } = req.body;

  try {
    const attemptData = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attemptData) throw new ClientError("Invalid attempt");

    const attemptAnswerData = await prisma.attemptAnswer.findFirst({
      where: { questionId, attemptId },
    });

    let attemptAnswer;

    if (attemptAnswerData) {
      attemptAnswer = await prisma.attemptAnswer.update({
        where: { id: attemptAnswerData.id },
        data: { answerId },
      });
    } else {
      attemptAnswer = await prisma.attemptAnswer.create({
        data: { attemptId, questionId, answerId },
      });
    }

    return res
      .status(201)
      .json({ message: "Answering successfully", data: attemptAnswer });
  } catch (error) {
    return next(error);
  }
};

const getAnswers = async (req, res, next) => {
  const { quizId } = req.params;

  try {
    const attemptData = await prisma.attempt.findFirst({
      where: { quizId, userId: req.user.id },
      include: {
        answers: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Answers retrieved successfully", data: attemptData });
  } catch (error) {
    return next(error);
  }
};

const getFinalScore = async (req, res, next) => {
  const { attemptId } = req.body;

  try {
    const attemptData = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            Question: {
              include: {
                Answer: true,
              },
            },
          },
        },
        answers: {
          include: {
            answer: true,
          },
        },
      },
    });

    if (!attemptData) throw new ClientError("Invalid attempt");

    const questionCount = attemptData.quiz.Question.length;
    let correctAnswerCount = 0;

    const review = attemptData.quiz.Question.map((question) => {
      const yourAnswer = attemptData.answers.find(
        (ans) => ans.questionId === question.id
      );
      const isCorrect = yourAnswer ? yourAnswer.answer.isCorrect : false;

      if (isCorrect) correctAnswerCount += 1;

      return {
        question: question.text,
        options: question.Answer.map((ans) => ({
          id: ans.id,
          text: ans.text,
          isCorrect: ans.isCorrect,
        })),
        yourAnswer: yourAnswer ? yourAnswer.answer.id : null,
        isCorrect,
      };
    });

    const score = (correctAnswerCount / questionCount) * 100;

    const updatedAttempt = await prisma.attempt.update({
      where: { id: attemptId },
      data: { score },
    });

    return res.status(200).json({
      message: "Result retrieved successfully",
      data: {
        title: attemptData.quiz.title,
        correct: correctAnswerCount,
        totalQuestions: questionCount,
        score: updatedAttempt.score,
        review,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createQuiz,
  createQuizWithQuestions,
  getAllQuizzesByContent,
  getQuizById,
  createQuestion,
  createAnswer,
  createAttempt,
  answerQuestion,
  getAnswers,
  getFinalScore,
};
