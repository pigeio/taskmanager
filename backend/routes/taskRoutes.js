const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskStatus,
  updateTaskCheckList,
  addComment,
  getComments
} = require("../controllers/taskController");

const router = express.Router();

//Task management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id", protect, updateTask);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/todo", protect, updateTaskCheckList);

// Comments
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", protect, getComments);

module.exports = router;
