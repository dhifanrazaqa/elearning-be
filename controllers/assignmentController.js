const prisma = require("../prismaClient");

const createAssignment = async (req, res) => {
  const { classId, title } = req.body;

  try {
    const assignment = await prisma.assignment.create({
      data: {
        title,
        classId,
      },
    });
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: "Error creating assignment", error: err.message });
  }
};

const submitAssignment = async (req, res) => {
  const { assignmentId } = req.body;

  try {
    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: req.user.id,
      },
    });
    res.status(201).json(submission);
  } catch (err) {
    res.next("Error submitting assignment");
  }
};

const gradeAssignment = async (req, res) => {
  const { submissionId, grade } = req.body;

  try {
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { grade },
    });
    res.json(updatedSubmission);
  } catch (err) {
    res.status(400).json({ message: "Error grading assignment", error: err.message });
  }
};

module.exports = { createAssignment, submitAssignment, gradeAssignment };
