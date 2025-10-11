import { Request, Response, NextFunction } from "express";
import * as notificationRepo from "../repositories/notificationRepository";
import { AppError } from "../utils/AppError";

export const getUserNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    const notifications = await notificationRepo.getNotificationsByUser(
      req.user.id
    );
    return res.json(notifications);
  } catch (err) {
    next(err);
  }
};
export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; //notificationId

    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }
    if (!id) {
      return next(new AppError("Notification ID is required", 400));
      // return res.status(400).json({ message: "Notification ID is required" });
    }
    let nid: number = Number(id);

    const notification = await notificationRepo.getNotificationById(nid);
    if (!notification) {
      return next(new AppError("Notification not found", 404));
    }

    if (notification.userId !== req.user.id) {
      return next(
        new AppError("Not authorized to update this notification", 403)
      );
    }

    const updated = await notificationRepo.markAsRead(nid);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};
