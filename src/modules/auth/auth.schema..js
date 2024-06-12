const joi = require("joi");

const SignUpSchema = joi
  .object({
    firstName: joi
      .string()
      .pattern(/^[a-zA-Z]{3,15}$/)
      .required(),
    lastName: joi
      .string()
      .pattern(/^[a-zA-Z]{3,15}$/)
      .required(),
    email: joi
      .string()
      .pattern(/^[a-zA-Z]{3,15}[0-9]{0,3}@(hotmail|gmail|yahoo).com$/)
      .required(),
    password: joi.string().required(),
    reaPetpassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({
        "any.only": "Passwords do not match",
      }),
  })
  .required();

const activateAcountSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = {
  SignUpSchema,
  activateAcountSchema,
  signInSchema,
};
