const Joi = require("joi");
const ClientError = require("../../../errors/clientError");

const schema = Joi.object({
  text: Joi.string().required(),
  forumId: Joi.string().required(),
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
