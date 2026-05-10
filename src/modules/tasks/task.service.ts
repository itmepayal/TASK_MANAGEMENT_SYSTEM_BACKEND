import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/middleware/error.middleware";
import Task, { IAttachment, IChecklistItem } from "@/models/task.model";

/* =========================================================
GET ALL TASKS
========================================================= */
export const getAllTasks = async (
  page: number = 1,
  limit: number = 10,
  filters?: {
    completed?: boolean;
    priority?: "low" | "medium" | "high";
    search?: string;
    assignedTo?: string;
    createdBy?: string;
  },
) => {
  const skip = (page - 1) * limit;

  const query: any = {};

  if (filters?.completed !== undefined) {
    query.completed = filters.completed;
  }

  if (filters?.priority) {
    query.priority = filters.priority;
  }

  if (filters?.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  if (filters?.createdBy) {
    query.createdBy = filters.createdBy;
  }

  if (filters?.search) {
    query.$or = [
      {
        text: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: filters.search,
          $options: "i",
        },
      },
    ];
  }

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Task.countDocuments(query),
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
GET TASK BY ID
========================================================= */
export const getTaskById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid task id", StatusCodes.BAD_REQUEST);
  }

  const task = await Task.findById(id)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  return task;
};

/* =========================================================
CREATE TASK
========================================================= */
export const createTask = async (data: {
  text: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate: Date;
  tags?: string[];
  assignedTo?: string[];
  createdBy: string;
  attachments?: IAttachment[];
  todoCheckLists?: IChecklistItem[];
}) => {
  const task = await Task.create(data);

  const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  return populatedTask;
};

/* =========================================================
UPDATE TASK
========================================================= */
export const updateTask = async (
  id: string,
  data: {
    text?: string;
    description?: string;
    completed?: boolean;
    priority?: "low" | "medium" | "high";
    progress?: number;
    dueDate?: Date;
    tags?: string[];
    assignedTo?: string[];
    attachments?: IAttachment[];
    todoCheckLists?: IChecklistItem[];
  },
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid task id", StatusCodes.BAD_REQUEST);
  }

  const task = await Task.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  return task;
};

/* =========================================================
UPDATE TASK STATUS
========================================================= */
export const updateTaskStatus = async (id: string, completed: boolean) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid task id", StatusCodes.BAD_REQUEST);
  }

  const task = await Task.findByIdAndUpdate(
    id,
    {
      completed,
      progress: completed ? 100 : 0,
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

/* =========================================================
UPDATE TASK CHECKLIST
========================================================= */
export const updateTaskChecklist = async (
  id: string,
  todoCheckLists: {
    title: string;
    completed: boolean;
  }[],
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid task id", StatusCodes.BAD_REQUEST);
  }

  const completedItems = todoCheckLists.filter((item) => item.completed).length;

  const progress =
    todoCheckLists.length > 0
      ? Math.round((completedItems / todoCheckLists.length) * 100)
      : 0;

  const task = await Task.findByIdAndUpdate(
    id,
    {
      todoCheckLists,
      progress,
      completed: progress === 100,
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

/* =========================================================
DELETE TASK
========================================================= */
export const deleteTask = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid task id", StatusCodes.BAD_REQUEST);
  }

  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new AppError("Task not found", StatusCodes.NOT_FOUND);
  }

  return task;
};

/* =========================================================
GET TASKS BY USER
========================================================= */
export const getTasksByUser = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find({
      $or: [
        {
          assignedTo: userId,
        },
        {
          createdBy: userId,
        },
      ],
    })
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Task.countDocuments({
      $or: [
        {
          assignedTo: userId,
        },
        {
          createdBy: userId,
        },
      ],
    }),
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
DASHBOARD TASK DATA
========================================================= */
export const getDashboardData = async () => {
  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    highPriorityTasks,
    overdueTasks,
    recentTasks,
  ] = await Promise.all([
    Task.countDocuments(),

    Task.countDocuments({
      completed: true,
    }),

    Task.countDocuments({
      completed: false,
    }),

    Task.countDocuments({
      priority: "high",
    }),

    Task.countDocuments({
      dueDate: {
        $lt: new Date(),
      },
      completed: false,
    }),

    Task.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar"),
  ]);

  return {
    overview: {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      overdueTasks,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },

    recentTasks,
  };
};

/* =========================================================
USER DASHBOARD TASK DATA
========================================================= */
export const getDashboardUserData = async (userId: string) => {
  const [
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    assignedTasks,
    recentTasks,
  ] = await Promise.all([
    Task.countDocuments({
      createdBy: userId,
    }),

    Task.countDocuments({
      createdBy: userId,
      completed: true,
    }),

    Task.countDocuments({
      createdBy: userId,
      completed: false,
    }),

    Task.countDocuments({
      createdBy: userId,
      dueDate: {
        $lt: new Date(),
      },
      completed: false,
    }),

    Task.countDocuments({
      assignedTo: userId,
    }),

    Task.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar"),
  ]);

  return {
    overview: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      assignedTasks,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },

    recentTasks,
  };
};
