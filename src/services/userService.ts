import { CreationAttributes } from "sequelize";
import { User } from "../models/user";
import * as userRepo from "../repositories/userRepository";
import bcrypt from "bcrypt";

import { UserCreationAttributes, UserResponse } from "focustime_types";

export async function createUserService(
  data: UserCreationAttributes
): Promise<UserResponse> {
  try {
    const existingUser = await userRepo.getUserByEmail(data.email || "");
    if (existingUser) {
      throw new Error("Email already in use");
      //   AppError("Email already in use", 400);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10); // 10 salt rounds
    data.password = hashedPassword;
    const user = await userRepo.createUser(data);

    const user_response: UserResponse = {
      uid: user.dataValues.uid,
      name: user.dataValues.name,
      email: user.dataValues.email!,
      role: user.dataValues.role,
    };

    return user_response;
  } catch (err) {
    throw new Error((err as Error).message || "Failed to create user");
    // throw new AppError((err as Error).message || "Failed to create user", 500);
  }
}
