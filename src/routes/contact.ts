import { Router } from "express";
import ContactMiddleware from "../middlewares/contact";
import { ContactServices } from "../services/contact";

const contactRoutes = Router();
const contactServices = new ContactServices();

const contactMiddleware = new ContactMiddleware();

contactRoutes.post("/add", contactMiddleware.validateContact, contactServices.createContact);
contactRoutes.get("/list", contactServices.getAllContacts);

export default contactRoutes;
