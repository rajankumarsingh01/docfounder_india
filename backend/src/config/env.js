/**
 * =====================================
 * Environment Variables Validation
 * =====================================
 *
 * Server start hone se pehle
 * required env variables verify karenge
 */

const requiredEnvVars = [
  "MONGO_URI",
  "PORT",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "CLIENT_URL"
];

/**
 * Validate Required Variables
 */
requiredEnvVars.forEach(
  (envVar) => {

    if (!process.env[envVar]) {

      console.error(
        `❌ Missing Environment Variable: ${envVar}`
      );

      process.exit(1);
    }
  }
);

/**
 * Export Environment Variables
 */
module.exports = {

  PORT:
    process.env.PORT,

  NODE_ENV:
    process.env.NODE_ENV || "development",

  MONGO_URI:
    process.env.MONGO_URI,

  CLIENT_URL:
    process.env.CLIENT_URL,

  JWT_SECRET:
    process.env.JWT_SECRET,

  JWT_EXPIRE:
    process.env.JWT_EXPIRE,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};