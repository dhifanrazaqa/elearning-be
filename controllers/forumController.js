const ClientError = require("../errors/clientError");
const prisma = require("../prismaClient");

const createForumPost = async (req, res, next) => {
  const { text, classId } = req.body;

  try {
    const classData = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classData) throw new ClientError("Invalid class");

    const forumPost = await prisma.forumPost.create({
      data: {
        text,
        classId,
        userId: req.user.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Forum post created successfully", data: forumPost });
  } catch (err) {
    return next(err);
  }
};

const getAllForumPostByClass = async (req, res, next) => {
  const { id } = req.params;

  try {
    const forumPosts = await prisma.forumPost.findMany({
      where: {
        classId: id,
      },
      include: {
        ForumReply: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        user: true,
        class: {
          select: {
            name: true,
            teach: true,
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Forum post retrieved successfully", data: forumPosts });
  } catch (err) {
    return next(err);
  }
};

const createForumReply = async (req, res, next) => {
  const { text, forumId } = req.body;

  try {
    const forumPostData = await prisma.forumPost.findUnique({
      where: { id: forumId },
    });

    if (!forumPostData) throw new ClientError("Invalid forum");

    const forumReply = await prisma.forumReply.create({
      data: {
        text,
        forumId,
        userId: req.user.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Forum Reply created successfully", data: forumReply });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createForumPost,
  getAllForumPostByClass,
  createForumReply,
};
