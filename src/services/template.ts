import { NextFunction, Request, Response } from "express";
import { Template } from "../models/template";
import { ContactRepository } from "../repository/contact";
import { Contact } from "../models/contact";
import { TemplateRepository } from "../repository/template";

export class TemplateServices {
    public async sendTemplates(req: Request<{}, {}, Template, {}>, res: Response, next: NextFunction) {
        try {

            const templateRepository = new TemplateRepository();

            const { receiverPhones } = req.body;

            receiverPhones.map(async (phone: string) => {
                await templateRepository.sendMessage(phone, req.body.templateName, req.body.key, req.body.wsIdentifier);
            });
            return res.status(200).send("Messages Sent");
        } catch (error) {
            console.log("miau");
            return res.status(400).send("Bad request");
        }
    }
}
