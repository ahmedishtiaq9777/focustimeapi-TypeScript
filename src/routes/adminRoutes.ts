import express from "express";
import * as adminController from "../controllers/adminController";
import { authenticateToken, authorizeAdmin } from "../middleware/middleware";

const router = express.Router();

router.use(authenticateToken, authorizeAdmin);

router.get(
  "/users",
  authenticateToken,
  authorizeAdmin,
  adminController.listAllUsers
);
router.get(
  "/logs",
  authenticateToken,
  authorizeAdmin,
  adminController.fetchLogs
);
router.get(
  "/logs/:key",
  authenticateToken,
  authorizeAdmin,
  adminController.getLogFileContent
);

export default router;
