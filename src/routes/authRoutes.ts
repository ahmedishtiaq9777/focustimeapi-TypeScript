import express from "express";
import { authenticateToken } from "../middleware/middleware";
import * as authcontroller from "../controllers/authController";

const router = express.Router();
router.post("/login", authcontroller.login);
router.post("/logout", authenticateToken, authcontroller.logout);
export default router;
