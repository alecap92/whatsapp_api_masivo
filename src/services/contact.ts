import { NextFunction, Request, Response } from "express";
import { ContactRepository } from "../repository/contact";
import { Contact } from "../models/contact";

export class ContactServices {
  public async createContact(req: Request<{}, {}, Contact[], {}>, res: Response, next: NextFunction) {
    try {
      const contactRepository = new ContactRepository();
      req.body.forEach(async (contact) => {
        await contactRepository.create({ ...contact, userId: req.user._id });
      });
      return res.status(201).send("Contact created");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getAllContacts(req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) {
    try {
      const contactRepository = new ContactRepository();
      const contacts = await contactRepository.getAllContacts(req.user._id!);
      return contacts.length > 0 ? res.status(200).send(contacts) : res.status(404).send("No contacts found");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }
}
