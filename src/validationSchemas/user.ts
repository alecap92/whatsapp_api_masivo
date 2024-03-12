import joi from "joi";

export const userValidationSchema = joi.object({
  name: joi.string().min(6).max(255).required(),
  email: joi.string().min(6).max(255).required().email(),
  password: joi.string().min(6).max(1024).required(),
});
