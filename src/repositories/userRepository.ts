import { CreationAttributes } from "sequelize";
import { User } from "../models";
import { UserInput } from "../types/IUser";
import { UserCreationAttributes, UserResponse } from "focustime_types";

export async function getAllUsers(): Promise<User[]> {
  return await User.findAll();
}
export async function getUserByEmail(email: string): Promise<User | null> {
  return await User.findOne({ where: { email } });
}

export async function createUser(
  userData: UserCreationAttributes
): Promise<User> {
  const user = await User.create(userData);

  return user;
}
