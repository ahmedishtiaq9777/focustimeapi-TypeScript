import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService";
import { AppError } from "../utils/AppError";
import { User } from "../models";
import { LogFile } from "../types/LogFile";

export const listAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: User[] = await adminService.listAllUsers();
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

export const fetchLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs: LogFile[] = await adminService.fetchLogsFromS3();
    return res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const getLogFileContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key } = req.params;
    if (!key) return next(new AppError("Log key is required", 400));

    const content: string = await adminService.getLogFileContent(key);
    return res.json({ key, content });
  } catch (err) {
    next(err);
  }
};
