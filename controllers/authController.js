const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthenticationError = require("../errors/authenticationError");
const ClientError = require("../errors/clientError");

const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, // "siswa" or "guru"
      },
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (err) {
    if(err.code === "P2002")
      return next(new ClientError("User already registered"))
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.json({ message: "Login successful", token });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };
