import { RequestHandler } from "express";

export interface TemplateMassive {
  templateName: string;
  key: string;
  file: RequestHandler;
  wsIdentifier: string;
  language: string;
  hasVars: boolean;
  createAt: Date;
  updateAt: Date;
}
