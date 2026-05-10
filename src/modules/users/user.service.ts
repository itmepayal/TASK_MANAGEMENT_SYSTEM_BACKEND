import { StatusCodes } from "http-status-codes";
import User from "@/models/user.model";
import { AppError } from "@/middleware/error.middleware";
import { deleteImage } from "@/config/cloudinary.config";
import Task from "@/models/task.model";
import mongoose from "mongoose";

/* =========================================================
REGISTER USER
========================================================= */
export const registerService = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new AppError("User already exists", StatusCodes.CONFLICT);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return user;
};

/* =========================================================
LOGIN USER
========================================================= */
export const loginService = async (email: string, password: string) => {
  const user: any = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
  }

  user.password = undefined;

  return user;
};

/* =========================================================
GET CURRENT USER
========================================================= */
export const getCurrentUserService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  return user;
};

/* =========================================================
UPDATE PROFILE
========================================================= */
export const updateProfileService = async (
  userId: string,
  data: {
    name?: string;
    avatar?: {
      url?: string;
      publicId?: string;
    };
  },
) => {
  const updateData: any = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.avatar) {
    updateData.avatar = {
      url: data.avatar.url || "",
      publicId: data.avatar.publicId || "",
    };
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  return user;
};

/* =========================================================
GET ALL USERS
========================================================= */
export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),

    User.countDocuments(),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* =========================================================
DELETE USER
========================================================= */
export const deleteUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id", StatusCodes.BAD_REQUEST);
  }
  const user: any = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.avatar?.publicId) {
    await deleteImage(user.avatar.publicId);
  }

  const tasks: any[] = await Task.find({
    $or: [{ createdBy: userId }, { assignedTo: userId }],
  });

  for (const task of tasks) {
    if (task.attachments?.length > 0) {
      await Promise.all(
        task.attachments.map(async (attachment: any) => {
          if (attachment.publicId) {
            await deleteImage(attachment.publicId);
          }
        }),
      );
    }
  }

  await Task.deleteMany({
    $or: [{ createdBy: userId }, { assignedTo: userId }],
  });

  await User.findByIdAndDelete(userId);

  return user;
};
