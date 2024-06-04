import express, { Router } from "express";
import TemplateMiddleware from "../middlewares/template";
import { TemplateServices } from "../services/template";
import { TemplateMassiveServices } from "../services/templateMassive";
import formidable from "express-formidable";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded());
app.use(formidable({ maxFileSize: 20 * 1024 * 1024 }));

const templateRoutes = Router();

const templateMiddleware = new TemplateMiddleware();
const templateServices = new TemplateServices();
const templateMassiveServices = new TemplateMassiveServices();


templateRoutes.post("/json", templateMiddleware.validateTemplate, templateServices.sendTemplates);
app.post("/file", templateMiddleware.validateTemplateMassive, templateMassiveServices.sendTemplates);

templateRoutes.use(app);

export default templateRoutes;
