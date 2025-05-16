const Task = require("../models/Task");

// Get all tasks
//@route  Get/api/tasks/
//@access private
const getTasks = async (req, res) => {
    try {
        // logic here
        const{status}= req.query;
        let filter = {};

        if (status){
            filter.status = status;
        }

        let tasks;

        if(req.user.role === "admin"){
            tasks = await tasks.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({
                assignedTo: req.user._id,
                ...filter,
            }).populate("assignedTo", "name email profileImageUrl");
        }

        //add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async(task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completedCount
                ).length;
                return {...task._doc, completedTodoCount: completedCount};
                
            })
        );

        //status summary counts 
        const allTasks = await task.countDocuments(
            req.user.role === "admin" ? {} : {assignedTo: req.user._id}
        );

        const pendingTasks = await Task.countDocuments({
            ...filter ,
            status: "pending",
            ...Task(req.user.role !== "admin" && {assignedTo: req.user._id}),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter ,
            status: "In progress",
            ...Task(req.user.role !== "admin" && {assignedTo: req.user._id}),
        });

        const completedTasks = await Task.countDocuments({
            ...filter ,
            status: "completed",
            ...(req.user.role !== "admin" && {assignedTo: req.user._id}),
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks
            },
        });



    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        // logic here
        const task = await Task.findById(req.params,id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if(!task) return res.status(404).json({message : "task not found"});
        
        res.json(task);


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new task
const createTask = async (req, res) => {
    try {
        // logic here
        const{
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachements,
            todoChecklist,
        } = req.body;

        if(!Array.isArray(assignedTo)) {
            return res
            .status(400)
            .json({message: "assignedTo must be an array of user IDs"});
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            todoChecklist,
            attachements,
        });

        res.status(201).json({message:"Task created successfully" , task});
    } catch (error) {
        res.status(400).json({ message: "Error creating task", error: error.message });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        // logic here
    } catch (error) {
        res.status(400).json({ message: "Error updating task", error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        // logic here
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        // logic here
    } catch (error) {
        res.status(400).json({ message: "Error updating status", error: error.message });
    }
};

// Update task checklist/todo
const updateTaskCheckList = async (req, res) => {
    try {
        // logic here
    } catch (error) {
        res.status(400).json({ message: "Error updating checklist", error: error.message });
    }
};

// Admin dashboard data
const getDashboardData = async (req, res) => {
    try {
        // logic here
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// User-specific dashboard data
const getUserDashboardData = async (req, res) => {
    try {
        // logic here
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getDashboardData,
    getUserDashboardData,
};

