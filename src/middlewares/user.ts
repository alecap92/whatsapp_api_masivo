import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { UserRepository } from "../repository/user";
import { userValidationSchema } from "../validationSchemas/user";

export class UserMiddleWare {
  public async validateUserExist(req: Request<{}, {}, User, {}>, res: Response, next: NextFunction) {
    try {
      const { error } = userValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).send(error.details[0].message);
      }

      const user = new UserRepository();

      const userExist = await user.findByEmail(req.body.email);
      if (userExist) {
        return res.status(400).send("User already exists");
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }

  public async validateUser(req: Request<{}, {}, User, {}>, res: Response, next: NextFunction) {
    try {
      const { error } = userValidationSchema.validate(req.body);

      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
}
