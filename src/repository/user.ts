import { User, UserModel } from "../models/user";

export class UserRepository {
  public async create(user: User) {
    try {
      return await UserModel.create(user);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async findByEmail(email: string) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  public async EditUser(user: User) {
    try {
      return await UserModel.findByIdAndUpdate(user._id, user, { new: true });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
