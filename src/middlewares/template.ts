import {
  templateMassiveValidationSchema,
  templateValidationSchema,
  templateValidationSchemaWithVars,
} from "../validationSchemas/template";
import { TemplateMassive } from "../models/templateMassive";
import { Request, Response, NextFunction } from "express";
import { Template } from "../models/template";

class TemplateMiddleware {
  public validateTemplate(req: Request<{}, {}, Template, {}>, res: Response, next: NextFunction) {
    try {
      const { error } = req.body.hasVars
        ? templateValidationSchemaWithVars.validate(req.body)
        : templateValidationSchema.validate(req.body)
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  public validateTemplateMassive(req: Request<{}, {}, TemplateMassive, {}>, res: Response, next: NextFunction) {
    try {
      const { error } = templateMassiveValidationSchema.validate(req.fields);

      if (!req.files?.file) {
        return res.status(400).json({ error: "File is required" });
      }

      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      next();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

export default TemplateMiddleware;
