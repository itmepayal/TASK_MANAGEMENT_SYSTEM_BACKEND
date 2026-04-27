import { Router } from "express";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTask,
} from "@/modules/task.controller";

// =========================================
// ROUTER INITIALIZATION
// =========================================
export const taskRouter = Router();

// =========================================
// ROUTES
// =========================================
taskRouter.get("/", getTasks);
taskRouter.post("/", createTask);
taskRouter.patch("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.patch("/:id/toggle", toggleTask);
