import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import {
  addBlacklistedToken,
  isTokenBlacklisted,
} from "../repositories/tokenRepository";
import { CreationAttributes } from "sequelize";
import { BlacklistedToken } from "../models";
import { JwtUserPayload } from "../types/jwtUserPayload";

const JWT_SECRET: string = process.env.ACCESS_TOKEN_SECRET ?? "";

const TOKEN_EXPIRY = "1h"; // you can make this configurable
if (!JWT_SECRET) throw new Error("ACCESS_TOKEN_SECRET is not defined");

export class JwtService {
  // Generate a JWT token
  static generateToken(payload: JwtUserPayload): string {
    const options: SignOptions = { expiresIn: TOKEN_EXPIRY };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  // Verify a JWT token and check if blacklisted
  static async verifyToken(token: string): Promise<JwtUserPayload> {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) throw new Error("Token is blacklisted");

    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    console.log("decoded:", decoded);
    // Type guard
    if (typeof decoded === "string") throw new Error("Invalid token payload");

    return decoded;
  }

  // blacklisting the token
  static async logout(token: string): Promise<void> {
    const decoded = jwt.decode(token) as JwtPayload | null;
    if (!decoded || !decoded.exp) throw new Error("Invalid token");

    const expiresAt = new Date(decoded.exp * 1000); // exp is in seconds
    const tokenData: CreationAttributes<BlacklistedToken> = {
      token: token,
      expires_at: expiresAt,
    };
    try {
      await addBlacklistedToken(tokenData);
      console.log("Token blacklisted:", token);
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        console.log("Token already blacklisted — ignoring duplicate.");
      } else {
        console.error("Error blacklisting token:", error);
        throw error;
      }
    }
  }
}
