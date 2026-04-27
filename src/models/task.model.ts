import mongoose, { Schema } from "mongoose";

/* =========================================================
SIMPLE INTERFACE
========================================================= */
export interface ITask {
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================================================
SCHEMA
========================================================= */
const taskSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Task text is required"],
      trim: true,
      minlength: [1, "Task cannot be empty"],
      maxlength: [200, "Task too long"],
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
) as any;

/* =========================================================
INDEXES
========================================================= */
taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1 });

/* =========================================================
MODEL
========================================================= */
const Task = mongoose.model("Task", taskSchema);

export default Task;
