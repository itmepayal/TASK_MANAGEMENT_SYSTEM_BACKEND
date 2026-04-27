import app from "@/app";
import { connectDB } from "@/config/db.config";
import { serverConfig } from "@/config";
import logger from "@/config/logger.config";

// =========================================
// MAIN SETUP
// =========================================
const startServer = async () => {
  try {
    await connectDB();

    const PORT = serverConfig.PORT || 8000;

    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
