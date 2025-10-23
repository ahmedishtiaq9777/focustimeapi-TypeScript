import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService";
import { AppError } from "../utils/AppError";
import { Task } from "../models";
import * as notirepo from "../repositories/notificationRepository";
import { CreateTaskDTO, TaskResponseDTO } from "focustime_types";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) return next(new AppError("Unauthorized", 403));
    const inputtask: CreateTaskDTO = req.body;
    if (
      !inputtask.title ||
      !inputtask.description ||
      !inputtask.scheduled_for ||
      !inputtask.priority
    ) {
      return next(new AppError("Incomplete Fields", 400));
    }

    const task: TaskResponseDTO = await taskService.createTaskService(
      { ...inputtask, user_id: userId },
      req.file
    );

    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    next(error);
  }
}

export async function getTasksWithSearchController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("Unauthorized", 403));

    const search = (req.query.search as string) || "";

    const tasks = await taskService.getTasksWithSearch(userId, search);

    res.json(tasks);
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    next(error);
  }
}

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    // console.log("userId:", req);
    if (!userId) return next(new AppError("Unauthorized", 403));

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await taskService.getTasksPaginationService(
      userId,
      page,
      limit
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const taskId = parseInt(req.params.id!);
    if (isNaN(taskId)) return next(new AppError("Invalid task ID", 400));

    const updatedTask = await taskService.updateTaskService(
      taskId,
      req.body,
      req.file
    );
    if (!updatedTask) return next(new AppError("Task not found", 404));

    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const taskId = parseInt(req.params.id!);
    if (isNaN(taskId)) return next(new AppError("Invalid task ID", 400));

    const deleted = await taskService.deleteTaskService(taskId);
    if (!deleted) return next(new AppError("Task not found", 404));

    const deletedCount = await notirepo.deleteNotificationByTaskId(taskId);
    if (deletedCount === false)
      console.log("No notification found for deleted task");

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getDashboardData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new AppError("Unauthorized", 403));

    const data = await taskService.getDashboardDataService(userId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    next(error);
  }
}
