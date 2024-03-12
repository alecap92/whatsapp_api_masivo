import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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

export interface User {
  email: string;
  password: string;
  name: string;
  createAt: Date;
  updateAt: Date;
  _id?: ObjectId;
}

export const UserModel = model("User", userSchema, "users");
