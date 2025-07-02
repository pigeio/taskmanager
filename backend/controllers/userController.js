const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "member", // Default role
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc    Get all users (admin only)
// @route   GET /api/users/
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password");

        // Add task counts to each user
        const usersWithTaskCounts = await Promise.all(
            users.map(async (user) => {
                const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
                const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In progress" });
                const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Complete" });

                return {
                    ...user._doc,
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
                };
            })
        );

        res.json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = {registerUser, getUsers, getUserById};

