import { Request, Response, NextFunction } from "express";
import logger from "@/config/logger.config";
import { ZodError } from "zod";

// =========================================
// CUSTOM ERROR CLASS
// =========================================
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// =========================================
// GLOBAL ERROR HANDLER
// =========================================
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // =========================================
  // DEFAULT ERROR VALUES
  // =========================================
  let statusCode = 500;
  let message = "Internal Server Error";

  // =========================================
  // HANDLE CUSTOM APP ERROR
  // =========================================
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // =========================================
  // HANDLE MONGOOSE ERRORS
  // =========================================
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // =========================================
  // HANDLE VALIDATION ERRORS
  // =========================================
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
  }

  // =========================================
  // HANDLE ZOD ERRORS
  // =========================================
  if (err instanceof ZodError) {
    statusCode = 400;

    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(statusCode).json({
      success: false,
      errors: formattedErrors,
    });
  }

  // =========================================
  // LOG ERROR
  // =========================================
  logger.error({
    message,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: err.stack,
  });

  // =========================================
  // FINAL ERROR RESPONSE
  // =========================================
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
