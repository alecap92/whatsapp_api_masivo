import { AuthKeys, generateToken } from "../auth/user";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { UserRepository } from "../repository/user";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export class UserServices {
  public async createUser(req: Request<{}, {}, User, {}>, res: Response, next: NextFunction) {
    try {
      const userRepository = new UserRepository();
      const { password } = req.body;
      const hashedPassword = await hashPassword(password);
      const user = await userRepository.create({ ...req.body, password: hashedPassword });
      const userAux = user?.toObject() as User;
      const token = await generateToken(userAux, res);
      res.cookie(AuthKeys.Authorization, token);
      return res.status(201).send(user);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getUser(req: Request, res: Response) {
    try {
      const userRepository = new UserRepository();
      const user = await userRepository.findByPhone(req.body.phone);
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async loginUser(req: Request<{}, {}, User, {}>, res: Response, NextFunction: NextFunction) {
    try {
      const userRepository = new UserRepository();
      const user = await userRepository.findByPhone(req.body.phone);
      const isValidPassword = await comparePassword(req.body.password, user!.password);

      if (!isValidPassword) return res.status(400).send("Invalid password");

      const userAux = user?.toObject() as User;
      const token = await generateToken(userAux, res);

      return res
        .cookie(AuthKeys.Authorization, token, { httpOnly: true, secure: true, sameSite: "none" })
        .status(200)
        .send({ ...userAux, password: "" });
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }
}
