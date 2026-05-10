import dotenv from "dotenv";

dotenv.config();

// =========================================
// TYPES & INTERFACES
// =========================================
type ServerConfig = {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  JWT_SECRET: string;
};

// =========================================
// ENVIRONMENT VARIABLE VALIDATOR
// =========================================
function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

// =========================================
// SERVER CONFIGURATION OBJECT
// =========================================
export const serverConfig: ServerConfig = {
  // =========================================
  // SERVER SETTINGS
  // =========================================
  PORT: Number(process.env.PORT) || 8000,
  NODE_ENV: getEnvVariable("NODE_ENV"),

  // =========================================
  // DATABASE CONFIGURATION
  // =========================================
  MONGO_URI: getEnvVariable("MONGO_URI"),

  // =========================================
  // CLOUDINARY CONFIGURATION
  // =========================================
  CLOUDINARY_CLOUD_NAME: getEnvVariable("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: getEnvVariable("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: getEnvVariable("CLOUDINARY_API_SECRET"),

  JWT_SECRET: getEnvVariable("JWT_SECRET"),
};
