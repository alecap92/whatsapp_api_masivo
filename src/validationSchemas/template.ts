import joi from "joi";

export const templateValidationSchema = joi.object({
  templateName: joi.string().min(4).max(20).required(),
  key: joi.string().min(150).max(255).required(),
  receiverPhones: joi.array().items(joi.string()).required(),
  hasVars: joi.boolean().required(),
  wsIdentifier: joi.string().length(15).required(),
  language: joi.string().required(),
});

export const templateValidationSchemaWithVars = joi.object({
  templateName: joi.string().min(4).max(20).required(),
  key: joi.string().min(150).max(255).required(),
  receiverPhonesWithVars: joi.array().items(joi.object()).required(),
  hasVars: joi.boolean().required(),
  wsIdentifier: joi.string().length(15).required(),
  language: joi.string().required(),
});

export const templateMassiveValidationSchema = joi.object({
  templateName: joi.string().min(4).max(20).required(),
  key: joi.string().min(150).max(255).required(),
  wsIdentifier: joi.string().length(15).required(),
  hasVars: joi.boolean().required(),
  language: joi.string().required(),
});
