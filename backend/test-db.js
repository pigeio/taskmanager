require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  console.log("🔍 Testing MongoDB Connection...");
  console.log("URI:", process.env.MONGO_URI ? "Defined (Hidden)" : "Not Defined");

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing in .env file");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fail fast if no connection
    });
    console.log("✅ MongoDB Connection Successful!");
    console.log("The database is active and reachable.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error(error.message);
    
    if (error.message.includes("bad auth")) {
      console.log("👉 Tip: Check your username and password in MONGO_URI.");
    } else if (error.message.includes("querySrv")) {
      console.log("👉 Tip: This might be a DNS issue or blocked network.");
    } else if (error.name === "MongooseServerSelectionError") {
      console.log("👉 Tip: Your IP might not be whitelisted in MongoDB Atlas Network Access.");
      console.log("   OR the Cluster might indeed be paused/stopped.");
    }
  }
};

testConnection();
