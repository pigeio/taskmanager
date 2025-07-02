const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization || "";
    console.log("Authorization Header:", tokenHeader);

    if (tokenHeader && tokenHeader.startsWith("Bearer ")) {
      const token = tokenHeader.split(" ")[1]; // ✅ define token BEFORE using it
      console.log("Extracted token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("JWT error:", error);
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

// Middleware for admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

module.exports = { protect, adminOnly };

