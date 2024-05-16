import { TemplateRepository } from "../repository/template";
import { TemplateMassive } from "../models/templateMassive";
import e, { NextFunction, Request, Response } from "express";
import xlsx from "xlsx";
import fs from "fs";
import { func } from "joi";

interface contactReceiver {
    name: string;
    phone: string;
}

function convertXlsxToCsv(inputFilePath: string): any[] {
    const workbook = xlsx.readFile(inputFilePath);
    let sheet_name_list = workbook.SheetNames;
    const finalData: any[] = [];
    sheet_name_list.forEach(function (y) {
        let worksheet = workbook.Sheets[y];
        let headers: any = {};
        let data = [];
        for (let z in worksheet) {
            if (z[0] === '!') continue;
            let tt = 0;
            for (let i = 0; i < z.length; i++) {
                if (!isNaN(Number(z[i]))) {
                    tt = i;
                    break;
                }
            };
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
}

export class TemplateMassiveServices {

    public async sendTemplates(req: Request<{}, {}, TemplateMassive, {}>, res: Response, next: NextFunction) {
        try {
            const templateRepository = new TemplateRepository();

            //@ts-ignore
            const filePath = req.files.file.path;
            const fileData = fs.readFileSync(filePath, "utf-8");

            const fileRows = fileData.split("\n");
            fileRows.shift();
            const formattedData = fileRows.map((row) => row.replace("\r", "").split(","));

            //@ts-ignore
            const fileExtension: string = req.files.file.type

            const successMessages: contactReceiver[] = [];
            const failedMessages: contactReceiver[] = [];

            if (fileExtension.includes("csv")) {
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
                        );
                        successMessages.push({
                            name: row[0],
                            phone: row[1],
                        });
                    } catch (error) {
                        console.error(error.message);
                        failedMessages.push({
                            name: row[0],
                            phone: row[1],
                        });
                    }
                }
            } else if (fileExtension.includes("excel") || fileExtension.includes("xml")) {
                const convertedData = convertXlsxToCsv(filePath);
                for (const row of convertedData) {
                    try {
                        await templateRepository.sendMessageWithVars(
                            row['Teléfono'].toString(),
                            //@ts-ignore
                            req.fields?.templateName,
                            req.fields?.key,
                            req.fields?.wsIdentifier,
                            row['Nombre'],
                            row['Variable'].toString(),
                        );
                        successMessages.push({
                            name: row['Nombre'],
                            phone: row['Teléfono'].toString(),
                        });
                    } catch (error) {
                        console.error(error.message);
                        failedMessages.push({
                            name: row['Nombre'],
                            phone: row['Teléfono'].toString(),
                        });
                    }
                }
            } else {
                return res.status(400).send("Invalid file format, please use xlsx, xls or csv files.");
            }

            return res.status(200).json({
                messagesSent: successMessages.length,
                messagesFailed: failedMessages.length,
                successMessages,
                failedMessages,
            });
        } catch (error) {
            console.error(error.message);
            return res.status(400).send("Bad request");
        }
    }
}
