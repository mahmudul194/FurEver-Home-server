const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Server will continue but DB operations will fail. Please check your MONGODB_URI in .env');
    // Don't exit - let server start so client gets a proper error instead of "Failed to fetch"
  }
};

module.exports = connectDB;
