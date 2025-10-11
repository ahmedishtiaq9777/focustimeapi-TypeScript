import { Notification } from "../models/notification";
import * as notificationRepo from "../repositories/notificationRepository";
import dayjs from "dayjs";
import schedule from "node-schedule";
import { CreationAttributes } from "sequelize";
import { Server } from "socket.io";
import { Task } from "../models";

let ioInstance: Server | null = null;

export function initNotificationService(io: Server): void {
  ioInstance = io;
}

export async function createAndScheduleNotification(
  task: Task,
  userId: number
): Promise<Notification> {
  const notificationMessage = `Reminder for task: ${task.title} scheduled for ${task.scheduled_for}`;

  // Save to DB
  const notification = await notificationRepo.createNotification({
    userId,
    taskId: task.id,
    message: notificationMessage,
    isRead: false,
  });

  // Schedule reminder 1 day before
  const reminderTime = dayjs(task.scheduled_for).subtract(1, "day").toDate();
  // const reminderTime = dayjs().add(10, "second").toDate(); // for testing

  schedule.scheduleJob(reminderTime, () => {
    console.log(`🔔 Sending reminder: ${task.title}`);
    if (ioInstance) {
      ioInstance.emit("reminder", { notification });
    }
  });

  return notification;
}
