import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export enum AuthKeys {
  Authorization = "Authorization",
  User = "user",
}

export async function generateToken(user: User, res: Response) {
  try {
    const { phone, _id, name } = user;
    const token = jwt.sign({ phone, _id, name, password: "" }, process.env.JWT_SECRET!);
    return token;
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[AuthKeys.Authorization];
    if (!token) return res.status(401).json("Access Denied");
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified as User;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid token");
  }
}
