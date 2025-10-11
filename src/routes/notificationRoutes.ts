import express from "express";

import * as notificationcontroller from "../controllers/notificationController";
import { authenticateToken } from "../middleware/middleware";

const router = express.Router();
router.use(authenticateToken);

router.get(
  "/notifications",
  authenticateToken,
  notificationcontroller.getUserNotifications
);
router.patch(
  "/notifications/:id/read",
  authenticateToken,
  notificationcontroller.markAsRead
);

export default router;
