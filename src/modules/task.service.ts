import { StatusCodes } from "http-status-codes";
import Task from "@/models/task.model";
import { AppError } from "@/middleware/error.middleware";

/* =========================================================
GET ALL TASKS
========================================================= */
export const getAllTasks = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* =========================================================
CREATE TASK
========================================================= */
export const createTask = async (data: {
  text: string;
  priority?: "low" | "medium" | "high";
}) => {
  return await Task.create(data);
};

/* =========================================================
DELETE TASK
========================================================= */
export const deleteTask = async (id: string) => {
  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  return task;
};

/* =========================================================
TOGGLE TASK
========================================================= */
export const toggleTask = async (id: string) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }
  task.completed = !task.completed;
  return await task.save();
};

/* =========================================================
COMPLATED TASK
========================================================= */
export const getCompletedTasks = async () => {
  return await Task.find({ completed: true });
};

/* =========================================================
UPDATED TASK
========================================================= */
export const updateTask = async (
  id: string,
  data: {
    text?: string;
    priority?: "low" | "medium" | "high";
  },
) => {
  const task = await Task.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  return task;
};
