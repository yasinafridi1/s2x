const Joi = require("joi");

const createPostSchema = {
  body: Joi.object({
    description: Joi.string().required(),
    type: Joi.string()
      .required()
      .valid("facebook", "instagram", "linkedin", "twitter"),
  }),
};

module.exports = {
  createPostSchema,
};
