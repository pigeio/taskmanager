require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const taskRoutes = require("./routes/taskRoutes")
const reportRoutes = require("./routes/reportRoutes")
const uploadsRoutes = require("./routes/uploadsRoutes");


const app = express();

//middleware to handle cors
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET" ,"POST","PUT","DELETE"],
        allowedHeaders: ["Content-type","Authorization"],
    })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Connect Database
connectDB();

//Middleware
app.use(express.json());


//routes
app.use("/api/auth",authRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/users",userRoutes);
app.use("/api/upload", uploadsRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT , () => console.log(`server running on port ${PORT}`));