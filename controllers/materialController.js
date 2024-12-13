const ClientError = require("../errors/clientError");
const prisma = require("../prismaClient");

const createMaterial = async (req, res, next) => {
  const { contentId, text } = req.body;

  try {
    const contentData = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!contentData) throw new ClientError("Invalid content");

    const material = await prisma.material.create({
      data: {
        contentId,
        text,
      },
    });
    return res
      .status(201)
      .json({ message: "Material created successfully", data: material });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createMaterial,
};
