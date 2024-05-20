import { TemplateRepository } from "../repository/template";
import { TemplateMassive } from "../models/templateMassive";
import e, { NextFunction, Request, Response } from "express";
import xlsx from "xlsx";
import fs from "fs";
import { func } from "joi";

interface contactReceiver {
  name?: string;
  phone: string;
}

const convertXlsxToCsv = (inputFilePath: string): any[] => {
  const workbook = xlsx.readFile(inputFilePath);
  let sheet_name_list = workbook.SheetNames;
  const finalData: any[] = [];
  sheet_name_list.forEach(function (y) {
    let worksheet = workbook.Sheets[y];
    let headers: any = {};
    let data = [];
    for (let z in worksheet) {
      if (z[0] === "!") continue;
      let tt = 0;
      for (let i = 0; i < z.length; i++) {
        if (!isNaN(Number(z[i]))) {
          tt = i;
          break;
        }
      }
      let col = z.substring(0, tt);
      let row = parseInt(z.substring(tt));
      let value = worksheet[z].v;

      if (row == 1 && value) {
        headers[col] = value;
        continue;
      }

      if (!data[row]) data[row] = {} as { [key: string]: any };
      data[row][headers[col]] = value;
    }
    data.shift();
    data.shift();
    finalData.push(...data);
  });
  return finalData;
};

const getObjectValues = (obj: { [x: string]: any }) => {
  let keys = Object.keys(obj);
  let values = keys.map((key) => obj[key]);
  return values;
};

const sendTemplateWithVars = async (
  req: Request<{}, {}, TemplateMassive, {}>,
  res: Response,
  successMessages: contactReceiver[],
  failedMessages: contactReceiver[],
  maxNumberOfMessages: number
) => {
  const templateRepository = new TemplateRepository();
  //@ts-ignore
  const filePath = req.files.file.path;
  const fileData = fs.readFileSync(filePath, "utf-8");

  const fileRows = fileData.split("\n");
  fileRows.shift();
  const formattedData = fileRows.map((row) => row.replace("\r", "").split(","));
  //@ts-ignore
  const fileExtension: string = req.files.file.type;
  if (fileExtension.includes("csv")) {
    if (formattedData.length >= maxNumberOfMessages) {
      res.status(400).send(`To send more than ${maxNumberOfMessages} messages, please upgrade your plan.`);
      return false;
    }

    for (const row of formattedData) {
      try {
        await templateRepository.sendMessageWithVars(
          row[1],
          //@ts-ignore
          req.fields?.templateName,
          req.fields?.key,
          req.fields?.wsIdentifier,
          row[0],
          row[2],
          req.fields?.language,
        );
        successMessages.push({
          name: row[0],
          phone: row[1],
        });
      } catch (error) {
        console.error(error);
        failedMessages.push({
          name: row[0],
          phone: row[1],
        });
      }
    }
  } else if (fileExtension.includes("excel") || fileExtension.includes("xml")) {
    const convertedData = convertXlsxToCsv(filePath);
    if (convertedData.length >= maxNumberOfMessages) {
      res.status(400).send(`To send more than ${maxNumberOfMessages} messages, please upgrade your plan.`);
      return false;
    }
    for (const row of convertedData) {
      try {
        await templateRepository.sendMessageWithVars(
          getObjectValues(row)[1].toString(),
          //@ts-ignore
          req.fields?.templateName,
          req.fields?.key,
          req.fields?.wsIdentifier,
          getObjectValues(row)[0],
          getObjectValues(row)[2],
          req.fields?.language,
        );
        successMessages.push({
          name: getObjectValues(row)[0],
          phone: getObjectValues(row)[1].toString(),
        });
      } catch (error) {
        console.error(error);
        failedMessages.push({
          name: getObjectValues(row)[0],
          phone: getObjectValues(row)[1].toString(),
        });
      }
    }
  } else {
    res.status(400).send("Invalid file format, please use xlsx, xls or csv files.");
    return false;
  }

  return true;
};

const sendTemplateNoVars = async (
  req: Request<{}, {}, TemplateMassive, {}>,
  res: Response,
  successMessages: contactReceiver[],
  failedMessages: contactReceiver[],
  maxNumberOfMessages: number
) => {
  const templateRepository = new TemplateRepository();

  //@ts-ignore
  const filePath = req.files.file.path;
  const fileData = fs.readFileSync(filePath, "utf-8");

  const fileRows = fileData.split("\n");
  fileRows.shift();
  const formattedData = fileRows.map((row) => row.replace("\r", "").split(","));
  //@ts-ignore
  const fileExtension: string = req.files.file.type;
  if (fileExtension.includes("csv")) {
    if (formattedData.length >= maxNumberOfMessages) {
      res.status(400).send(`To send more than ${maxNumberOfMessages} messages, please upgrade your plan.`);
      return false;
    }

    for (const row of formattedData) {
      try {
        await templateRepository.sendMessage(
          row[0],
          //@ts-ignore
          req.fields?.templateName,
          req.fields?.key,
          req.fields?.wsIdentifier,
          req.fields?.language,
        );
        successMessages.push({
          phone: row[0],
        });
      } catch (error) {
        console.error(error);
        failedMessages.push({
          phone: row[0],
        });
      }
    }
  } else if (fileExtension.includes("excel") || fileExtension.includes("xml")) {
    const convertedData = convertXlsxToCsv(filePath);
    if (convertedData.length >= maxNumberOfMessages) {
      res.status(400).send(`To send more than ${maxNumberOfMessages} messages, please upgrade your plan.`);
      return false;
    }
    for (const row of convertedData) {
      try {
        await templateRepository.sendMessage(
          getObjectValues(row)[0].toString(),
          //@ts-ignore
          req.fields?.templateName,
          req.fields?.key,
          req.fields?.wsIdentifier,
          req.fields?.language,
        );
        successMessages.push({
          phone: getObjectValues(row)[0].toString(),
        });
      } catch (error) {
        console.error(error);
        failedMessages.push({
          phone: getObjectValues(row)[0].toString(),
        });
      }
    }
  } else {
    res.status(400).send("Invalid file format, please use xlsx, xls or csv files.");
    return false;
  }

  return true;
};

export class TemplateMassiveServices {
  public async sendTemplates(req: Request<{}, {}, TemplateMassive, {}>, res: Response, next: NextFunction) {
    try {
      const successMessages: contactReceiver[] = [];
      const failedMessages: contactReceiver[] = [];

      const hasVars = req.fields?.hasVars ?? {};

      const maxNumberOfMessages: number = Number(String(process.env.MAX_NUMBER_OF_MESSAGES));

      const success =
        hasVars === "true"
          ? await sendTemplateWithVars(req, res, successMessages, failedMessages, maxNumberOfMessages)
          : await sendTemplateNoVars(req, res, successMessages, failedMessages, maxNumberOfMessages);

      if (!success) {
        return;
      }

      return res.status(200).json({
        messagesSent: successMessages.length,
        messagesFailed: failedMessages.length,
        successMessages,
        failedMessages,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).send("Bad request");
    }
  }
}
