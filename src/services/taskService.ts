import { s3 } from "../config/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Op } from "sequelize";
import * as taskRepo from "../repositories/taskRepository";
import { createAndScheduleNotification } from "./notificationService";
import { Task } from "../models/task";
import { CreationAttributes } from "sequelize";
import express from "express";
import multer from "multer";
import { uploadTaskImage, getTaskImageUrl } from "../utils/s3helper";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  CreateTaskDTO,
  PaginatedTasksResponse,
  DashboardDataResponse,
} from "focustime_types";

const bucketName = process.env.BUCKET_NAME!; // imagebucket

export async function createTaskService(
  data: CreateTaskDTO,
  file?: Express.Multer.File
): Promise<Task> {
  let imageNametemp: string | null = null;

  if (file) {
    console.log("file", file);
    imageNametemp = `${Date.now()}-${file.originalname}`;
    await uploadTaskImage(
      file.buffer,
      imageNametemp,
      bucketName,
      file.mimetype
    );
  }

  const imageName: string = imageNametemp!;
  const task: Task = await taskRepo.createTask({
    ...data,
    image_url: imageName,
  });

  await createAndScheduleNotification(task, data.user_id);
  return task;
}

export async function getTasksWithSearch(
  userId: number,
  search = ""
): Promise<Task[]> {
  const whereClause: any = { user_id: userId };
  if (search.trim()) {
    whereClause.title = { [Op.like]: `%${search.trim()}%` };
  }

  const tasks: Task[] = await taskRepo.getTasksByUserSearch(whereClause);

  for (const task of tasks) {
    if (task.image_url) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: task.image_url,
      });
      task.image_url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    }
  }

  return tasks;
}
export async function getTaskByIdService(taskId: number): Promise<Task | null> {
  const task: Task | null = await taskRepo.getTaskById(taskId);

  if (task && task.image_url) {
    task.image_url = await getTaskImageUrl(task.image_url, bucketName);
  }

  return task;
}

export async function updateTaskService(
  taskId: number,
  updates: Partial<Task>,
  file?: Express.Multer.File
): Promise<Task | null> {
  if (file) {
    console.log("file:", file);
    const imageName = `${Date.now()}-${file.originalname}`;
    await uploadTaskImage(file.buffer, imageName, bucketName, file.mimetype);
    updates.image_url = imageName;
  }

  return await taskRepo.updateTask(taskId, updates);
}

export async function deleteTaskService(taskId: number): Promise<boolean> {
  return await taskRepo.deleteTask(taskId);
}

export async function getTasksByUserService(userId: number): Promise<Task[]> {
  const tasks: Task[] = await taskRepo.getTasksByUser(userId);

  for (const task of tasks) {
    if (task.image_url) {
      task.image_url = await getTaskImageUrl(task.image_url, bucketName);
    }
  }

  return tasks;
}

export async function getTasksPaginationService(
  userId: number,
  page = 1,
  limit = 5
): Promise<PaginatedTasksResponse> {
  const offset = (page - 1) * limit;
  //

  const totaltasks: number = await taskRepo.countTasks(userId);
  const tasks: Task[] = await taskRepo.getTaskPagination(userId, limit, offset);

  for (const task of tasks) {
    if (task.image_url) {
      task.image_url = await getTaskImageUrl(task.image_url, bucketName);
    }
  }
  const paginatedresponse: PaginatedTasksResponse = {
    tasks,
    currentPage: page,
    totalPages: Math.ceil(totaltasks / limit),
    totaltasks,
  };

  return paginatedresponse;
}

export async function getDashboardDataService(
  userId: number
): Promise<DashboardDataResponse> {
  const total = await taskRepo.countTasks(userId);
  const completed = await taskRepo.countTasksCompleted(userId);
  const pending = await taskRepo.countTasksPending(userId);
  const highPriority = await taskRepo.countTasksHighPriority(userId);

  const upcomingTasks = await taskRepo.getUpcomingTasks();
  const importantTasks = await taskRepo.getImportantTasks();

  // console.log("important tasks:", importantTasks);
  for (const task of [...upcomingTasks, ...importantTasks]) {
    console.log("task.image url:", task);
    if (task.image_url) {
      console.log("image_url:", task.image_url);
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: task.image_url,
      });
      task.image_url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      console.log("after change :", task.image_url);
    }
  }

  return {
    summary: { total, completed, pending, highPriority },
    upcomingTasks,
    importantTasks,
  };
}
