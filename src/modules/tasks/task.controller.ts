import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as taskService from "@/modules/tasks/task.service";
import { ApiResponse } from "@/utils/apiResponse";
import logger from "@/config/logger.config";
import { AppError } from "@/middleware/error.middleware";
import Task from "@/models/task.model";
import { uploadImage, deleteImage } from "@/config/cloudinary.config";

/* =========================================================
GET ALL TASKS
========================================================= */
export const getTasks = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const filters = {
    completed:
      req.query.completed !== undefined
        ? req.query.completed === "true"
        : undefined,

    priority: req.query.priority as "low" | "medium" | "high",

    search: req.query.search as string,

    assignedTo: req.query.assignedTo as string,

    createdBy: req.query.createdBy as string,
  };

  const result = await taskService.getAllTasks(page, limit, filters);

  logger.info("Fetched tasks successfully", {
    page,
    limit,
    filters,
  });

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Tasks fetched successfully", result));
};

/* =========================================================
GET TASK BY ID
========================================================= */
export const getTaskById = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  const task = await taskService.getTaskById(taskId);

  logger.info(`Fetched task: ${taskId}`);

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task fetched successfully", task));
};

/* =========================================================
CREATE TASK
========================================================= */
export const createTask = async (req: Request, res: Response) => {
  let attachments: any[] = [];

  if (req.files && Array.isArray(req.files)) {
    attachments = await Promise.all(
      req.files.map(async (file: Express.Multer.File) => {
        const uploaded = await uploadImage(file.path, {
          folder: "tasks",
        });

        return {
          url: uploaded.url,
          publicId: uploaded.public_id,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
        };
      }),
    );
  }

  const task = await taskService.createTask({
    text: req.body.text,
    description: req.body.description,
    priority: req.body.priority,
    dueDate: req.body.dueDate,

    tags:
      typeof req.body.tags === "string"
        ? JSON.parse(req.body.tags)
        : req.body.tags || [],
    assignedTo: req.body.assignedTo || [],
    createdBy: (req as any).user._id,
    todoCheckLists:
      typeof req.body.todoCheckLists === "string"
        ? JSON.parse(req.body.todoCheckLists)
        : req.body.todoCheckLists || [],
    attachments,
  });

  logger.info(`Task created: ${task?._id}`);

  return res
    .status(StatusCodes.CREATED)
    .json(ApiResponse.success("Task created successfully", task));
};

/* =========================================================
UPDATE TASK
========================================================= */
export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  const existingTask = await Task.findById(taskId);

  if (!existingTask) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  let newAttachments: any[] = [];

  if (req.files && Array.isArray(req.files)) {
    newAttachments = await Promise.all(
      req.files.map(async (file: Express.Multer.File) => {
        const uploaded = await uploadImage(file.path, {
          folder: "tasks",
        });

        return {
          url: uploaded.url,
          publicId: uploaded.public_id,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
        };
      }),
    );
  }

  let existingAttachments = [...(existingTask.attachments || [])];

  if (req.body.removeAttachmentIds) {
    const removeAttachmentIds =
      typeof req.body.removeAttachmentIds === "string"
        ? JSON.parse(req.body.removeAttachmentIds)
        : req.body.removeAttachmentIds;

    await Promise.all(
      existingAttachments
        .filter((item: any) => removeAttachmentIds.includes(item.publicId))
        .map((item: any) => deleteImage(item.publicId)),
    );

    existingAttachments = existingAttachments.filter(
      (item: any) => !removeAttachmentIds.includes(item.publicId),
    );
  }

  const mergedAttachments = [...existingAttachments, ...newAttachments];

  const updateData: any = {
    attachments: mergedAttachments,
  };

  if (req.body.text !== undefined) {
    updateData.text = req.body.text;
  }

  if (req.body.description !== undefined) {
    updateData.description = req.body.description;
  }

  if (req.body.createdBy !== undefined) {
    updateData.createdBy = req.body.createdBy;
  }

  if (req.body.priority !== undefined) {
    updateData.priority = req.body.priority;
  }

  if (req.body.completed !== undefined) {
    updateData.completed = req.body.completed === "true";
  }

  if (req.body.progress !== undefined) {
    updateData.progress = req.body.progress;
  }

  if (req.body.dueDate !== undefined) {
    updateData.dueDate = req.body.dueDate;
  }

  if (req.body.tags !== undefined) {
    updateData.tags =
      typeof req.body.tags === "string"
        ? JSON.parse(req.body.tags)
        : req.body.tags;
  }

  if (req.body.assignedTo !== undefined) {
    updateData.assignedTo = req.body.assignedTo;
  }

  if (req.body.todoCheckLists !== undefined) {
    updateData.todoCheckLists =
      typeof req.body.todoCheckLists === "string"
        ? JSON.parse(req.body.todoCheckLists)
        : req.body.todoCheckLists;
  }

  const task = await taskService.updateTask(taskId, updateData);

  logger.info(`Task updated: ${taskId}`);

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task updated successfully", task));
};

/* =========================================================
UPDATE TASK STATUS
========================================================= */
export const updateTaskStatus = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  const { completed } = req.body;

  const task = await taskService.updateTaskStatus(taskId, completed);

  logger.info(`Task status updated: ${taskId}`);

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task status updated successfully", task));
};

/* =========================================================
UPDATE TASK CHECKLIST
========================================================= */
export const updateTaskChecklist = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  const { todoCheckLists } = req.body;

  const task = await taskService.updateTaskChecklist(taskId, todoCheckLists);

  logger.info(`Task checklist updated: ${taskId}`);

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task checklist updated successfully", task));
};

/* =========================================================
DELETE TASK
========================================================= */
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id as string;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  if (task.attachments && task.attachments.length > 0) {
    await Promise.all(
      task.attachments.map(async (attachment: any) => {
        if (attachment.publicId) {
          await deleteImage(attachment.publicId);
        }
      }),
    );
  }

  await taskService.deleteTask(taskId);

  logger.warn(`Task deleted: ${taskId}`);

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Task deleted successfully"));
};

/* =========================================================
GET TASKS BY USER
========================================================= */
export const getTasksByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await taskService.getTasksByUser(userId, page, limit);

  logger.info(`Fetched tasks for user: ${userId}`);

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("User tasks fetched successfully", result));
};

/* =========================================================
GET DASHBOARD DATA
========================================================= */
export const getDashboardData = async (req: Request, res: Response) => {
  const data = await taskService.getDashboardData();

  logger.info("Fetched dashboard data");

  return res
    .status(StatusCodes.OK)
    .json(ApiResponse.success("Dashboard data fetched successfully", data));
};

/* =========================================================
GET USER DASHBOARD DATA
========================================================= */
export const getDashboardUserData = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  const data = await taskService.getDashboardUserData(userId);

  logger.info(`Fetched dashboard data for user: ${userId}`);

  return res
    .status(StatusCodes.OK)
    .json(
      ApiResponse.success("User dashboard data fetched successfully", data),
    );
};
