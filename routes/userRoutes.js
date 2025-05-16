const express = require("express");
const {adminOnly, protect} = require("../middlewares/authMiddleware");
const {getUsers, deleteUser, getUserById} = require("../controllers/userController");

const router = express.Router();

//user Management Routes
router.get("/",protect, adminOnly , getUsers);
router.get("/:id", protect, getUserById);


module.exports = router;