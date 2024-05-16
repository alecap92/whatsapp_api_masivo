import { RequestHandler } from "express";

export interface TemplateMassive {
  templateName: string;
  key: string;
  file: RequestHandler;
  wsIdentifier: string;
  createAt: Date;
  updateAt: Date;
}
