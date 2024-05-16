import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { Contact, ContactModel } from "../models/contact";
import { contactValidationSchema } from "../validationSchemas/contact";

class ContactMiddleware {
  public validateContact(req: Request<{}, {}, Contact[], {}>, res: Response, next: NextFunction) {
    try {
      req.body.map(async (contact) => {
        let contactExist = await ContactModel.findOne({ phone: contact.phone});
        contactExist = await ContactModel.findOne({ name: contact.name});
        const { error } = contactValidationSchema.validate(contact);

        if (contactExist) {
          return res.status(400).send(`One or more contacts already exists`);
        }

        if (error) {
          return res.status(400).send(error.details[0].message);
        }
        next();
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal server error");
    }
  }
}

export default ContactMiddleware;
