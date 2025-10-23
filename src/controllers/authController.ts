import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import { createUser, getUserByEmail } from "../repositories/userRepository";
import { JwtService } from "../services/jwtservice";
import { AppError } from "../utils/AppError";
import { User } from "../models/user";
import { UserResponse } from "focustime_types";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const plainUser = user.get({ plain: true });

    const { password: _, ...safeuser } = plainUser;

    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = JwtService.generateToken({
      id: user.dataValues.uid,
      email: user.dataValues.email!,
      role: user.dataValues.role,
    });

    return res.json({ token, user: safeuser });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError("Token required", 401));
    }

    await JwtService.logout(token);

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
