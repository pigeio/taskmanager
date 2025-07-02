const express = require("express");
const {adminOnly, protect} = require("../middlewares/authMiddleware");
const {getUsers, deleteUser, getUserById} = require("../controllers/userController");
const { registerUser } = require("../controllers/authController");

const router = express.Router();

//Registration route
router.post("/register" , registerUser);

//user Management Routes
router.get("/",protect, adminOnly , getUsers);
router.get("/:id", protect, getUserById);


module.exports = router;