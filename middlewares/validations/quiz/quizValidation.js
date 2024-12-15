const Joi = require("joi");
const ClientError = require("../../../errors/clientError");

const schema = Joi.object({
  title: Joi.string().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        options: Joi.array().items(Joi.object()).required(),
        correctOption: Joi.number().required(),
      })
    )
    .required(),
  description: Joi.string().required(),
  duration: Joi.number().required(),
  contentId: Joi.string().required(),
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
