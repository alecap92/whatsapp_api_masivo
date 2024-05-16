import joi from "joi";

export const userValidationSchema = joi.object({
  name: joi.string().min(6).max(255).required(),
  phone: joi.string().pattern(/^\+\d{10,15}$/).required(),
  password: joi.string().min(6).max(1024).required(),
});

export const userLoginValidationSchema = joi.object({
  phone: joi.string().pattern(/^\+\d{10,15}$/).required(),
  password: joi.string().min(6).max(1024).required(),
});
