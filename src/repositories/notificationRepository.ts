import { Notification } from "../models/notification";
import { CreationAttributes } from "sequelize";
export async function getNotificationsByUser(
  userId: number
): Promise<Notification[]> {
  return await Notification.findAll({ where: { userId, isRead: false } });
}
export async function getNotificationById(
  nid: number
): Promise<Notification | null> {
  return await Notification.findByPk(nid);
}
export async function createNotification(
  notificationData: CreationAttributes<Notification>
): Promise<Notification> {
  return await Notification.create(notificationData);
}
export async function markAsRead(id: number): Promise<Notification | null> {
  const notification = await Notification.findByPk(id);
  if (!notification) return null;

  await notification.update({ isRead: true });
  return notification;
}

export async function deleteNotificationByTaskId(
  taskId: number
): Promise<boolean> {
  const deleted = await Notification.destroy({
    where: { taskId: taskId },
  });
  return deleted > 0;
}
