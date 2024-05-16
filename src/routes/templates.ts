import express, { Router } from "express";
import TemplateMiddleware from "../middlewares/template";
import { TemplateServices } from "../services/template";
import { TemplateMassiveServices } from "../services/templateMassive";
import formidable from "express-formidable";



const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(formidable());

const templateRoutes = Router();

const templateMiddleware = new TemplateMiddleware();
const templateServices = new TemplateServices();
const templateMassiveServices = new TemplateMassiveServices();

app.post("/send_massive", templateMiddleware.validateTemplateMassive, templateMassiveServices.sendTemplates)

templateRoutes.post("/send", templateMiddleware.validateTemplate, templateServices.sendTemplates);
templateRoutes.use(app);


export default templateRoutes;
