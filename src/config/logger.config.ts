import winston from "winston";

// =========================================
// LOG LEVEL DEFINITIONS
// =========================================
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// =========================================
// ENVIRONMENT-BASED LOG LEVEL
// =========================================
const level = (): string => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";

  // More verbose logging in development, restricted in production
  return isDevelopment ? "debug" : "warn";
};

// =========================================
// LOG LEVEL COLORS
// =========================================
const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "white",
};

// Apply colors to Winston
winston.addColors(colors);

// =========================================
// LOG FORMAT CONFIGURATION
// =========================================
const format = winston.format.combine(
  // Add timestamp to logs
  winston.format.timestamp({
    format: "DD MMM, YYYY - HH:mm:ss:ms",
  }),

  // Enable colorized output
  winston.format.colorize({ all: true }),

  // Custom log message format
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
  ),
);

// =========================================
// LOG TRANSPORTS (OUTPUT TARGETS)
// =========================================
const transports = [
  // Console output (for development)
  new winston.transports.Console(),

  // File logs for different severity levels
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  new winston.transports.File({
    filename: "logs/info.log",
    level: "info",
  }),

  new winston.transports.File({
    filename: "logs/http.log",
    level: "http",
  }),
];

// =========================================
// LOGGER INSTANCE CREATION
// =========================================
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// =========================================
// EXPORT LOGGER
// =========================================
export default logger;
