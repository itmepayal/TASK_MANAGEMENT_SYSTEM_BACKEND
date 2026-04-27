import { Router } from "express";
import { taskRouter } from "@/modules/task.route";

// =========================================
// ROUTER INITIALIZATION
// =========================================
const router = Router();

// =========================================
// ROUTE REGISTRATION
// =========================================
router.use("/tasks", taskRouter);

// =========================================
// EXPORT ROUTER
// =========================================
export default router;
