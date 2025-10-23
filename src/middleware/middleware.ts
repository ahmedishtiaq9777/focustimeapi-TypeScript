import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { JwtService } from "../services/jwtservice";
import { JwtUserPayload } from "../types/jwtUserPayload";
import { isTokenBlacklisted } from "../repositories/tokenRepository";

// custom property in Request
declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUserPayload;
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    console.log("path:", req.path);
    console.log("middlewahere");
    if (!token) throw new AppError("No token provided", 401);
    //blacklist check
    const isblacklist: boolean = await isTokenBlacklisted(token);
    if (isblacklist)
      throw new AppError("Token is blacklisted (logged out)", 401);

    // verify token

    try {
      const userPayload = await JwtService.verifyToken(token);
      req.user = userPayload;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "TokenExpiredError") {
          if (await isTokenBlacklisted(token)) {
            throw new AppError("Token Expired and blacklisted", 403);
          }

          JwtService.logout(token); //blacklisting token
          throw new AppError("Token Expired", 403);
        }
      }
    }

    next();
  } catch (err) {
    next(err);
  }
}

export function authorizeAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "admin") {
    return next(new AppError("Access denied. Admins only.", 403));
  }
  next();
}
