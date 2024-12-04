const ClientError = require("../errors/clientError");
const NotFoundError = require("../errors/notFoundError");
const prisma = require("../prismaClient");

const createClass = async (req, res, next) => {
  const { name, description } = req.body;
  const { id } = req.user;
  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        teacherId: id,
      },
    });
    return res
      .status(201)
      .json({ message: "Class created successfully", newClass });
  } catch (err) {
    return next("Error creating class");
  }
};

const getAllClass = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany();
    res.status(200).json({ data: classes });
  } catch (err) {
    return next(err);
  }
};

const getClassById = async (req, res, next) => {
  const { classId } = req.params;
  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: { students: true, teach: true },
    });

    if (!classData) throw new NotFoundError("Class not found");

    res.status(200).json({ data: classData });
  } catch (err) {
    return next(err);
  }
};

const getClassByUserId = async (req, res, next) => {
  try {
    let classesData = [];
    if (req.user.role === "siswa") {
      classesData = await prisma.classOnUser.findMany({
        where: { userId: req.user.id },
        select: {
          class: true,
        },
      });
      classesData = classesData.flatMap((item) => item.class);
      if (!classesData) throw new NotFoundError("Class not found");
    } else {
      classesData = await prisma.class.findMany({
        where: { teacherId: req.user.id },
      });

      if (!classesData) throw new NotFoundError("Class not found");
    }

    res
      .status(200)
      .json({ message: "Class retrieved successfully", data: classesData });
  } catch (err) {
    return next(err);
  }
};

const addStudent = async (req, res, next) => {
  const { classId, studentId } = req.body;
  try {
    const studentData = await prisma.user.findUnique({
      where: { id: studentId, role: "siswa" },
    });

    if (!studentData) throw new ClientError("Invalid User");

    const classData = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) throw new ClientError("Invalid class");

    const student = await prisma.classOnUser.create({
      data: {
        classId,
        userId: studentId,
      },
    });
    return res.json({ message: "Student added successfully", student });
  } catch (err) {
    if (err.code === "P2002")
      return next(new ClientError("User already joined class"));
    return next(err);
  }
};

const removeStudentFromClass = async (req, res, next) => {
  const { classId, studentId } = req.body;

  try {
    const studentData = await prisma.user.findUnique({
      where: { id: studentId, role: "siswa" },
    });

    if (!studentData) throw new ClientError("Invalid User");

    const classData = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) throw new ClientError("Invalid class");

    await prisma.classOnUser.deleteMany({
      where: {
        classId,
        userId: studentId,
      },
    });
    return res.json({ message: "Student removed from class successfully" });
  } catch (err) {
    return next("Error removing student from class");
  }
};

module.exports = {
  createClass,
  getAllClass,
  getClassById,
  getClassByUserId,
  addStudent,
  removeStudentFromClass,
};
