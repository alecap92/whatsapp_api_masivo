import joi from "joi";

export const templateValidationSchema = joi.object({
  templateName: joi.string().min(4).max(20).required(),
  key: joi.string().min(150).max(255).required(),
  receiverPhones: joi.array().items(joi.string()).required(),
  wsIdentifier: joi.string().length(15).required()
});

export const templateMassiveValidationSchema = joi.object({
  templateName: joi.string().min(4).max(20).required(),
  key: joi.string().min(150).max(255).required(),
  wsIdentifier: joi.string().length(15).required()
});
