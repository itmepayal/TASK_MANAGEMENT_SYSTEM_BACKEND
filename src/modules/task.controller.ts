import { Request, Response } from "express";
import * as taskService from "@/modules/task.service";
import { ApiResponse } from "@/utils/apiResponse";
import logger from "@/config/logger.config";
import { StatusCodes } from "http-status-codes";

/* =========================================================
GET ALL TASKS
========================================================= */
export const getTasks = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await taskService.getAllTasks(page, limit);
  logger.info("Fetched paginated tasks", { page, limit });
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Tasks fetched successfully", result));
};

/* =========================================================
CREATE TASK
========================================================= */
export const createTask = async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);
  logger.info(`Task created: ${task._id}`);
  return res
    .status(StatusCodes.CREATED)
    .json(ApiResponse.success("Task created successfully", task));
};

/* =========================================================
DELETE TASK
========================================================= */
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  await taskService.deleteTask(taskId);
  logger.warn(`Task deleted: ${taskId}`);
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task deleted successfully"));
};

/* =========================================================
TOGGLE TASK
========================================================= */
export const toggleTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  const task = await taskService.toggleTask(taskId);
  logger.info(`Task toggled: ${taskId}`);
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task toggled successfully", task));
};

/* =========================================================
UPDATE TASK
========================================================= */
export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  const { text, priority } = req.body;
  const task = await taskService.updateTask(taskId, { text, priority });
  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task toggled successfully", task));
};
