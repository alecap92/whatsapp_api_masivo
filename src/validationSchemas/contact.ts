import joi from "joi";

export const contactValidationSchema = joi.object({
  name: joi.string().min(3).max(255).required(),
  phone: joi.string().min(10).max(20).required(),
});
