import dotenv from "dotenv";

dotenv.config();

// =========================================
// TYPES & INTERFACES
// =========================================
type ServerConfig = {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
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
};
