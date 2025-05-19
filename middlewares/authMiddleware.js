const jwt = require("jsonwebtoken");
const User = require("../models/User");

//middleware to protect routes
const protect = async (req,res,next) => {
    try{
        let tokenHeader = req.headers.authorization || "";
        console.log("Authorization Header:", token);

        if(token && token.startsWith("Bearer")){
            const token = tokenHeader.split(" ")[1];
            console.log("Extracted token:", token);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        }else{
            res.status(401).json({ message: "Not authorized, no token"});
        }
    }catch(error){
        console.error("JWT error:", error);
        res.status(401).json({message: "Token failed" , error: error.message});
    }
};

//middleware admin-only access
const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        res.status(403).json({message: "Access denied, admin only"});
    }
};

module.exports = {protect , adminOnly};
