import { Task } from "../models/task";
import { CreationAttributes } from "sequelize";
const { Op } = require("sequelize");
import {
  NotStarted,
  inProgress,
  Completed,
  PriorityHigh,
} from "../constants/constants";

export async function getAllTasks(): Promise<Task[]> {
  return await Task.findAll();
}
export async function getTaskById(id: number): Promise<Task | null> {
  return await Task.findByPk(id);
}
// Create task
export async function createTask(
  taskData: CreationAttributes<Task>
): Promise<Task> {
  return await Task.create(taskData);
}

export async function updateTask(
  id: number,
  updates: Partial<CreationAttributes<Task>>
): Promise<Task | null> {
  const task = await Task.findByPk(id);
  if (!task) return null;

  await task.update(updates);
  return task;
}
export async function deleteTask(id: number): Promise<boolean> {
  const deleted = await Task.destroy({ where: { id } });
  return deleted > 0;
}

export async function getTasksByUser(userId: number): Promise<Task[]> {
  return await Task.findAll({ where: { user_id: userId } });
}
export async function getTasksByUserSearch(where: any): Promise<Task[]> {
  return await Task.findAll({ where });
}
export async function countTasks(userId: number): Promise<number> {
  return await Task.count({ where: { user_id: userId } });
}
export async function countTasksCompleted(userId: number) {
  return await Task.count({ where: { user_id: userId, status: Completed } });
}
export async function countTasksPending(userId: number) {
  return await Task.count({ where: { user_id: userId, is_completed: false } });
}
export async function countTasksHighPriority(userId: number) {
  return await Task.count({
    where: { user_id: userId, priority: PriorityHigh },
  });
}

export async function getTaskPagination(
  userId: number,
  limit: number,
  offset: number
): Promise<Task[]> {
  return await Task.findAll({
    where: { user_id: userId },
    limit,
    offset,
    order: [
      ["created_at", "DESC"],
      ["id", "DESC"],
    ],
  });
}

// Upcoming tasks (within 7 days)
export async function getUpcomingTasks(limit = 5): Promise<Task[]> {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  console.log("upcomming");
  console.log("today:", today);
  console.log("nextweek:", nextWeek);
  return await Task.findAll({
    where: {
      is_completed: false,
      scheduled_for: { [Op.between]: [new Date(today), new Date(nextWeek)] },
    },
    raw: true,
    order: [["scheduled_for", "ASC"]],
    limit,
  });
}

export async function getImportantTasks(limit = 5): Promise<Task[]> {
  console.log("important");
  return await Task.findAll({
    where: { is_completed: false, priority: "Extreme" },
    raw: true,
    order: [["scheduled_for", "ASC"]],
    limit,
  });
}
