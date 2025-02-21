require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MongoDB connection URI is missing. Check your .env file.");
  process.exit(1);
}

// MongoDB connection function with retries
const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully...");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Connect to the database
connectDB();

// Event listeners for MongoDB connection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err.message);
});

// Export the mongoose instance
module.exports = mongoose;
