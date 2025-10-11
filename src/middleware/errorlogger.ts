import { Request, Response, NextFunction } from "express";
import logger from "../middleware/logger";
import safeBody from "../utils/safeBody";
import { AppError } from "../utils/AppError";

/**
 * Express error handling middleware
 */
export function errorLogger(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    status: (err as AppError).status,
    body: safeBody(req.body),
  });

  const status: number = (err as AppError).status || 500;
  const message = status === 500 ? "Internal Server Error" : err.message;

  res.status(status).json({ error: message });
}
