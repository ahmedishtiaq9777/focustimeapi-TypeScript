import express from "express";
import * as userController from "../controllers/userController";
// import { authenticateToken, authorizeAdmin } from "../middleware/middleware";

const router = express.Router();

router.post("/adduser", userController.createUser);

export default router;
