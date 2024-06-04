import { NextFunction, Request, Response } from "express";
import { PhoneAndVars, Template } from "../models/template";
import { TemplateRepository } from "../repository/template";

async function sendTemplateWithoutVars(
  phone: string,
  req: Request<{}, {}, Template, {}>,
  templateRepository: TemplateRepository,
  successMessages: any[],
  errorsList: any[],
) {
  try {
    await templateRepository.sendMessage(
      phone,
      req.body.templateName,
      req.body.key,
      req.body.wsIdentifier,
      req.body.language,
    );
    successMessages.push({
      phone,
    });
  } catch (error) {
    errorsList.push({
      phone,
      error: error.toString(),
    });
    console.error(error);
  }
}

async function sendTemplateWithVars(
  phone: string,
  vars: string[],
  req: Request<{}, {}, Template, {}>,
  templateRepository: TemplateRepository,
  successMessages: any[],
  errorsList: any[],
) {
  try {
    await templateRepository.sendMessageWithVars(
      phone,
      req.body.templateName,
      req.body.key,
      req.body.wsIdentifier,
      vars,
      req.body.language,
    );
    successMessages.push({
      phone,
    });
  } catch (error) {
    errorsList.push({
      phone,
      error: error.toString(),
    });
    console.error(error);
  }
}

export class TemplateServices {
  public async sendTemplates(req: Request<{}, {}, Template, {}>, res: Response, next: NextFunction) {
    try {
      const templateRepository = new TemplateRepository();
      const successMessages: any[] = [];
      const errorsList: any[] = [];

      const { receiverPhones, receiverPhonesWithVars, hasVars } = req.body;

      const sendFunctions = 
        hasVars && receiverPhonesWithVars !== undefined ? receiverPhonesWithVars.map((receiver: PhoneAndVars) => {
          return sendTemplateWithVars(receiver.phone, receiver.vars, req, templateRepository, successMessages, errorsList);
        }) : !hasVars && receiverPhones && receiverPhones.map((phone: string) => {
          return sendTemplateWithoutVars(phone, req, templateRepository, successMessages, errorsList);
        });

      await Promise.all(sendFunctions || []);

      return res.status(200).json({
        messagesSent: successMessages.length,
        messagesFailed: errorsList.length,
        successMessages,
        errorsList,
      });
    } catch (error) {
      console.error(error);
      const currentDate = new Date();
      return res.status(500).send(`Internal server error at: ${currentDate} ${error}`);
    }
  }
}
