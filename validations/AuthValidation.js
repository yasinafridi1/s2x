const Joi = require("joi");

const passwordSchema = Joi.string()
  .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9]).{8,15}$"))
  .required()
  .messages({
    "string.pattern.base":
      "Password must include at least 1 uppercase letter, 1 number, and be 8-15 characters long",
  });

const AuthValidation = {
  signupSchema: {
    body: Joi.object({
      fullName: Joi.string().required().max(100),
      email: Joi.string().required().max(120),
      password: passwordSchema,
    }),
  },

  signInSchema: {
    body: Joi.object({
      email: Joi.string().email().messages({
        "string.email": "Please provide a valid email address",
      }),
      password: Joi.string().required(),
    }),
  },

  refreshTokenValidation: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
  addUpdateTokenSchema: {
    body: Joi.object({
      token: Joi.string().required(),
      type: Joi.string()
        .required()
        .valid("facebook", "instagram", "linkedin", "twitter"),
      pageId: Joi.when("type", {
        is: "facebook",
        then: Joi.string()
          .required()
          .messages({ "any.required": "pageId is required for Facebook" }),
        otherwise: Joi.optional(),
      }),
      userId: Joi.when("type", {
        is: Joi.valid("instagram", "linkedin"),
        then: Joi.string().required().messages({
          "any.required": "userId is required for Instagram and LinkedIn",
        }),
        otherwise: Joi.optional(),
      }),
    }),
  },
};

module.exports = AuthValidation;
