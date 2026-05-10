import mongoose, { Schema, Types } from "mongoose";

/* =========================================================
INTERFACES
========================================================= */
export interface IChecklistItem {
  title: string;
  completed: boolean;
}

export interface IAttachment {
  url: string;
  publicId?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface ITask {
  text: string;
  description?: string;

  completed: boolean;

  priority: "low" | "medium" | "high";

  progress: number;

  dueDate?: Date;

  tags: string[];

  assignedTo?: Types.ObjectId[];

  createdBy: Types.ObjectId;

  attachments: IAttachment;

  todoCheckLists: IChecklistItem;

  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================================================
CHECKLIST SCHEMA
========================================================= */
const checklistSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

/* =========================================================
ATTACHMENT SCHEMA
========================================================= */
const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: String,

    fileName: String,

    fileType: String,

    fileSize: Number,
  },
  {
    _id: false,
  },
);

/* =========================================================
TASK SCHEMA
========================================================= */
const taskSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
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

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    todoCheckLists: {
      type: [checklistSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* =========================================================
INDEXES
========================================================= */
taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ assignedTo: 1 });

/* =========================================================
PRE SAVE
========================================================= */
taskSchema.pre("save", function (next) {
  const task = this as any;

  if (task.todoCheckLists?.length > 0) {
    const completedItems = task.todoCheckLists.filter(
      (item: any) => item.completed,
    ).length;

    task.progress = Math.round(
      (completedItems / task.todoCheckLists.length) * 100,
    );
  }

  if (task.progress === 100) {
    task.completed = true;
  }
});

/* =========================================================
VIRTUALS
========================================================= */
taskSchema.virtual("isOverdue").get(function () {
  const task = this as any;

  return task.dueDate && task.dueDate < new Date() && !task.completed;
});

/* =========================================================
MODEL
========================================================= */
const Task = mongoose.model("Task", taskSchema);

export default Task;
