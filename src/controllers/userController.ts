import { Request, Response, NextFunction } from "express";
import * as userRepo from "../repositories/userRepository";
import * as userService from "../services/userService";
import { AppError } from "../utils/AppError";
import { User } from "../models";
import { UserInput } from "../types/custom";
import { UserCreationAttributes } from "focustime_types";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Name, email, and password are required", 400));
    }

    const user = req.body as UserCreationAttributes;

    const newUser = await userService.createUserService(user);

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}
