const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const contentRoutes = require("./routes/contentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const NotFoundMiddleware = require("./middlewares/notFoundMiddleware");
const ErrorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/classes", classRoutes);
app.use("/contents", contentRoutes);
app.use("/assignments", assignmentRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(NotFoundMiddleware);
app.use(ErrorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
