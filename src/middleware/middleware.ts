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
    // if (req.path === "/login") return next();

    if (!token) throw new AppError("No token provided", 401);
    //blacklist check
    const isblacklist: boolean = await isTokenBlacklisted(token);
    if (isblacklist)
      throw new AppError("Token is blacklisted (logged out)", 401);

    // verify token
    const userPayload = await JwtService.verifyToken(token);
    console.log("userPayload:", userPayload);
    req.user = userPayload;
    console.log("req.user:", req.user);

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
