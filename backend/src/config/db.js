const mongoose = require("mongoose");
const env = require("./env");

/**
 * MongoDB Connection
 */
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log(
      "✅ MongoDB Connected Successfully"
    );

  } catch (error) {
    console.error(
      "❌ MongoDB Connection Failed"
    );

    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;