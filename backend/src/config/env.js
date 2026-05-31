const requiredEnvVars = [
  "MONGO_URI",
  "PORT",
  "JWT_SECRET",
  "JWT_EXPIRE",
  "CLIENT_URL",
  "RESEND_API_KEY",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing Environment Variable: ${envVar}`);
    process.exit(1);
  }
});

module.exports = {
  PORT:           process.env.PORT,
  NODE_ENV:       process.env.NODE_ENV || "development",
  MONGO_URI:      process.env.MONGO_URI,
  CLIENT_URL:     process.env.CLIENT_URL,
  JWT_SECRET:     process.env.JWT_SECRET,
  JWT_EXPIRE:     process.env.JWT_EXPIRE,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};