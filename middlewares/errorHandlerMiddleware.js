const ClientError = require("../errors/clientError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  return res.status(500).json({
    message: err.message,
  });
};

module.exports = errorHandler;
