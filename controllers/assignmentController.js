const ClientError = require("../errors/clientError");
const prisma = require("../prismaClient");

const createAssignment = async (req, res, next) => {
  const {
    contentId,
    title,
    description = null,
    fileUrl = null,
    startDate,
    deadline,
  } = req.body;

  try {
    const contentData = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!contentData) throw new ClientError("Invalid content");

    const assignment = await prisma.assignment.create({
      data: {
        contentId,
        title,
        description,
        fileUrl,
        startDate,
        deadline,
      },
    });
    return res
      .status(201)
      .json({ message: "Assignment created successfully", data: assignment });
  } catch (err) {
    return next("Error creating assignment");
  }
};

const getAllSubmissionByAssignment = async (req, res, next) => {
  const { classId, assignmentId } = req.params;

  try {
    const assignmentData = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignmentData) throw new ClientError("Invalid assignment");

    const submissions = await prisma.classOnUser.findMany({
      where: {
        classId,
      },
      select: {
        user: {
          select: {
            name: true,
            email: true,
            Submission: {
              where: {
                assignmentId,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "Submissions retrieved successfuilly",
      data: submissions,
    });
  } catch (error) {
    return next(error);
  }
};

const submitAssignment = async (req, res, next) => {
  const { assignmentId, text, fileUrl } = req.body;
  const { id } = req.user;

  try {
    const assignmentData = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignmentData) throw new ClientError("Invalid assignment");

    const now = new Date();
    const status = now <= assignmentData.deadline ? "on-time" : "late";

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: id,
        text,
        fileUrl,
        status,
      },
    });
    return res.status(201).json({
      message: "Assignment submitted successfuilly",
      data: submission,
    });
  } catch (err) {
    return next("Error submitting assignment");
  }
};

const gradeAssignment = async (req, res, next) => {
  const { submissionId, grade } = req.body;
  try {
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { grade },
    });
    return res.json({
      message: "Grade added successfully",
      data: updatedSubmission,
    });
  } catch (err) {
    return next("Error grading assignment");
  }
};

const getAllAssignment = async (req, res, next) => {
  const { contentId } = req.params;
  try {
    const assignmentData = await prisma.Assignment.findMany({
      where: {
        contentId,
      },
    });
    if (!assignmentData) throw new ClientError("Invalid Assignment");
    return res.json({
      message: "Retrieved Assignment data successfully",
      data: assignmentData,
    });
  } catch (err) {
    return next("Error retrieving Assignment data");
  }
};

const getAssignmentById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const assignmentData = await prisma.Assignment.findUnique({
      where: {
        id,
      },
    });
    if (!assignmentData) throw new ClientError("Invalid Assignment");
    return res.json({
      message: "Retrieved Assignment data successfully",
      data: assignmentData,
    });
  } catch (err) {
    return next("Error retrieving Assignment data");
  }
};

const getSubmissionById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const assignmentData = await prisma.Submission.findUnique({
      where: {
        id,
      },
    });
    if (!assignmentData) throw new ClientError("Invalid Assignment");
    return res.json({
      message: "Retrieved Assignment data successfully",
      data: assignmentData,
    });
  } catch (err) {
    return next("Error retrieving Assignment data");
  }
};

const checkSubmission = async (req, res, next) => {
  const { assignmentId } = req.params;
  try {
    const submissionData = await prisma.submission.findFirst({
      where: {
        assignmentId,
        studentId: req.user.id,
      },
    });
    if (!submissionData) throw new ClientError("Invalid submission");
    return res.json({
      message: "Retrieved submission data successfully",
      data: submissionData,
    });
  } catch (err) {
    return next("Error retrieving submission data");
  }
};

module.exports = {
  getSubmissionById,
  getAllAssignment,
  getAssignmentById,
  createAssignment,
  getAllSubmissionByAssignment,
  submitAssignment,
  gradeAssignment,
  checkSubmission,
};
