const Joi = require("joi");
const ClientError = require("../../../errors/clientError");

const schema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  role: Joi.string().valid(...["siswa", "guru"]).required(),
  password: Joi.string().min(8).required(),
});

const validate = (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw new ClientError(error.message);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;
