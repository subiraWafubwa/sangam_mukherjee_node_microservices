const joi = require("joi");

const validateRegistration = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[a-z])(?=.*[\\d!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,30}$"
        ) // Allows at least one small letter, one capital and one number/special character.
      )
      .required(),
  });

  return schema.validate(data);
};

module.exports = { validateRegistration };
