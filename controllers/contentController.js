const ClientError = require("../errors/clientError");
const prisma = require("../prismaClient");

const createContent = async (req, res, next) => {
  const { classId, title, body } = req.body;

  try {
    const classData = await prisma.class.findUnique({ where: { id: classId } });

    if (!classData) throw new ClientError("Invalid class");

    if (classData.teacherId !== req.user.id)
      throw new ClientError("You're not the author");

    const content = await prisma.content.create({
      data: {
        title,
        body,
        classId,
      },
    });
    return res
      .status(201)
      .json({ message: "Content added successfully", content });
  } catch (err) {
    return next("Error creating content");
  }
};

const getClassContents = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const classData = await prisma.class.findUnique({ where: { id: classId } });

    if (!classData) throw new ClientError("Invalid class");

    const contents = await prisma.content.findMany({
      where: { classId: classId },
    });
    return res.json({ message: "Contents retrieved successfully", contents });
  } catch (err) {
    return next(err);
  }
};

const getClassContent = async (req, res, next) => {
  const { classId, contentId } = req.params;

  try {
    const classData = await prisma.class.findUnique({ where: { id: classId } });

    if (!classData) throw new ClientError("Invalid class");

    const contents = await prisma.content.findUnique({
      where: { id: contentId, classId },
    });
    return res.json({ message: "Content retrieved successfully", contents });
  } catch (err) {
    return next("Error fetching content");
  }
};

const deleteClassContent = async (req, res, next) => {
  const { classId } = req.params;
  const { contentId } = req.body;
  try {
    const classData = await prisma.class.findUnique({ where: { id: classId } });

    if (!classData) throw new ClientError("Invalid class");

    if (classData.teacherId !== req.user.id)
      throw new ClientError("You're not the author");

    const contentData = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!contentData) throw new ClientError("Invalid content");

    await prisma.content.delete({
      where: { id: contentId },
    });
    return res.json({ message: "Content deleted successfully" });
  } catch (err) {
    return next("Error deleting content");
  }
};

module.exports = {
  createContent,
  getClassContents,
  getClassContent,
  deleteClassContent,
};
