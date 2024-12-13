const ClientError = require("../errors/clientError");
const NotFoundError = require("../errors/notFoundError");
const prisma = require("../prismaClient");

const createClass = async (req, res, next) => {
  const { name, description, imageUrl } = req.body;
  const { id } = req.user;
  try {
    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        teacherId: id,
        imageUrl,
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
      include: {
        teach: true,
        contents: {
          include: {
            assignments: true,
            materials: true,
            Quiz: true,
          },
        },
      },
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
    let allClassesData = [];
    if (req.user.role === "siswa") {
      classesData = await prisma.classOnUser.findMany({
        where: { userId: req.user.id },
        select: {
          class: true,
        },
      });

      allClassesData = await prisma.class.findMany({
        where: {
          students: {
            none: { userId: req.user.id },
          },
        },
      });

      classesData = classesData.flatMap((item) => item.class);
      if (!classesData) throw new NotFoundError("Class not found");
    } else {
      classesData = await prisma.class.findMany({
        where: { teacherId: req.user.id },
      });

      allClassesData = await prisma.class.findMany({
        where: {
          NOT: {
            teacherId: req.user.id,
          },
        },
      });

      if (!classesData) throw new NotFoundError("Class not found");
    }

    res.status(200).json({
      message: "Class retrieved successfully",
      data: { userData: classesData, allData: allClassesData },
    });
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
        status: "wait",
      },
    });
    return res.json({ message: "Student added successfully", student });
  } catch (err) {
    if (err.code === "P2002")
      return next(new ClientError("User already joined class"));
    return next(err);
  }
};

const changeStudentStatus = async (req, res, next) => {
  const { classId, studentId } = req.body;
  try {
    const classOnUserData = await prisma.classOnUser.findUnique({
      where: {
        userId_classId: {
          userId: studentId,
          classId: classId,
        },
      },
    });

    if (!classOnUserData) throw new ClientError("Invalid Data");

    const result = await prisma.classOnUser.update({
      where: {
        userId_classId: {
          userId: studentId,
          classId: classId,
        },
      },
      data: {
        status: classOnUserData.status === "wait" ? "acc" : "wait",
      },
    });

    return res.json({
      message: "Student status changed successfully",
      data: result,
    });
  } catch (error) {
    return next("Error changing student status in class");
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

const getAllStudentInClass = async (req, res, next) => {
  const { id } = req.params;
  try {
    const classData = await prisma.class.findUnique({
      where: { id },
    });

    if (!classData) throw new ClientError("Invalid class");

    const students = await prisma.classOnUser.findMany({
      where: { classId: id },
      include: { user: true },
    });
    return res.json({
      message: "Retrieved class students data successfully",
      data: students,
    });
  } catch (error) {
    return next("Error retrieving students data");
  }
};

module.exports = {
  createClass,
  getAllClass,
  getClassById,
  getClassByUserId,
  addStudent,
  changeStudentStatus,
  removeStudentFromClass,
  getAllStudentInClass,
};
