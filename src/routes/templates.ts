import { Router } from "express";
import TemplateMiddleware from "../middlewares/template";
import { TemplateServices } from "../services/template";
import { TemplateMassiveServices } from "../services/templateMassive";

const templateRoutes = Router();

const templateMiddleware = new TemplateMiddleware();
const templateServices = new TemplateServices();
const templateMassiveServices = new TemplateMassiveServices();

templateRoutes.post("/send", templateMiddleware.validateTemplate, templateServices.sendTemplates);
templateRoutes.post("/send_massive", templateMiddleware.validateTemplateMassive, templateMassiveServices.sendTemplates);

export default templateRoutes;
