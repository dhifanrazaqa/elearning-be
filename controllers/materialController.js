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

const getMaterialById = async (req, res, next) => {
  const { materialId } = req.params;

  try {
    const materialData = await prisma.material.findUnique({
      where: { id: materialId },
      include: {
        content: true,
      },
    });

    if (!materialData) throw new ClientError("Invalid material");

    return res
      .status(200)
      .json({ message: "Material retrieved successfully", data: materialData });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createMaterial,
  getMaterialById,
};
