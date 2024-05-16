import { ref } from "joi";
import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

export interface Contact {
  phone: string;
  name: string;
  userId?: ObjectId;
  createAt: Date;
  updateAt: Date;
  _id?: ObjectId;
}

export const ContactModel = model("Contact", contactSchema, "contacts");
