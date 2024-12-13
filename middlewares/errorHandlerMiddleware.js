const ClientError = require("../errors/clientError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  console.log(err);
  return res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = errorHandler;
