import routes from "@/routes";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { specs } from "@/config/swagger";
import { errorHandler } from "@/middleware/error.middleware";
import express, { Request, Response, NextFunction } from "express";

// =========================================
// APP SETUP
// =========================================
const app = express();

// =========================================
// CORS CONFIGURATION
// =========================================
const allowedOrigins: string[] = [
  process.env.ADMIN_URL,
  process.env.CLIENT_URL,
  "https://task-management-system-frontend-bss.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8081",
  "http://10.0.2.2:8081",
  "http://10.0.2.2:8000",
].filter(Boolean) as string[];

// =========================================
// CORS SETUP
// =========================================
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// =========================================
// CORS SETUP
// =========================================
app.use(cors(corsOptions));

// =========================================
// MIDDLEWARE SETUP
// =========================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =========================================
// COOKIE PARSER
// =========================================
app.use(cookieParser());

// =========================================
// API ROUTES
// =========================================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use("/api", routes);

// =========================================
// API Docs ROUTES
// =========================================
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// =========================================
// GLOBAL ERROR HANDLER
// =========================================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
