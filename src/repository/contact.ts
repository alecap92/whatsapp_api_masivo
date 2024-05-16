import { Types } from "mongoose";
import { Contact, ContactModel } from "../models/contact";

export class ContactRepository {
  public async create(contact: Contact) {
    try {
      return await ContactModel.create(contact);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async findById(_id: string): Promise<Contact | null> {
    try {
      return await ContactModel.findById({ _id });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async findByIds(ids: string[]): Promise<Contact[] | null> {
    try {
      return await ContactModel.find({ _id: { $in: ids } })
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  

  public async getAllContacts(userId: Types.ObjectId) {
    try {
      return await ContactModel.find({ userId });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async editContact(contact: Contact) {
    try {
      return await ContactModel.findByIdAndUpdate(contact._id, contact, { new: true });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
