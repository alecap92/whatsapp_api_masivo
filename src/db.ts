import { connect } from "mongoose";

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
};
