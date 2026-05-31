/**
 * =====================================
 * DocFinder Backend Entry Point
 * =====================================
 *
 * Responsibility:
 * 1. Load Environment Variables
 * 2. Validate Environment
 * 3. Connect Database
 * 4. Start Express Server
 *
 * IMPORTANT:
 * - Business Logic ❌
 * - Routes ❌
 * - Controllers ❌
 *
 * Ye sab src/ ke andar rahega.
 */

require("dotenv").config();

/**
 * Environment Validation
 *
 * Agar required env variable missing hua
 * to yahi file startup pe crash kar degi.
 */
const env = require("./src/config/env");



const logger =
  require(
    "./src/utils/logger"
  );

/**
 * Express App Import
 */
const app = require("./src/app");

/**
 * MongoDB Connection Function
 */
const connectDB = require("./src/config/db");

/**
 * Start Server Function
 *
 * Async rakha hai taaki pehle DB connect ho
 * fir server start ho.
 */
const startServer = async () => {
  try {
    /**
     * Database Connection
     */
    await connectDB();

    /**
     * Port
     */
    const PORT = env.PORT || 5000;

    /**
     * Server Start
     */
    app.listen(PORT, () => {
 logger.log(
  `🚀 Server running on port ${PORT}`
);
    });

  } catch (error) {
    logger.error(
      "❌ Server Startup Failed",
      { message: error.message }
    );
    

    console.error(error);

    process.exit(1);
  }
};

/**
 * Execute Startup
 */
startServer();