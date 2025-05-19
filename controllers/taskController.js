const mongoose = require("mongoose");
const Task = require("../models/Task");

// Get all tasks
//@route  Get/api/tasks/
//@access private
// GET /api/tasks?status=pending
// private
const getTasks = async (req, res) => {
  try {
    /* ─────────── 1. Build base filter ─────────── */
    const { status } = req.query;
    const baseFilter = status ? { status } : {};

    /* ─────────── 2. Scope by role ─────────── */
    const roleFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    /* ─────────── 3. Fetch tasks with populate ─────────── */
    let tasks = await Task.find({ ...baseFilter, ...roleFilter }).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    /* ─────────── 4. Add completed-todo count ─────────── */
    tasks = tasks.map((task) => {
      const completedTodoCount = task.todoChecklist?.filter(
        (item) => item.completed            // <-- correct property
      ).length || 0;

      // spread the Mongoose document’s plain object form
      return { ...task.toObject(), completedTodoCount };
    });

    /* ─────────── 5. Status summary counts ─────────── */
    const allTasks = await Task.countDocuments(roleFilter);

    const pendingTasks = await Task.countDocuments({
      ...roleFilter,
      status: "pending",
    });

    const inProgressTasks = await Task.countDocuments({
      ...roleFilter,
      status: "In Progress",           // match schema exactly
    });

    const completedTasks = await Task.countDocuments({
      ...roleFilter,
      status: "Completed",             // match schema exactly
    });

    /* ─────────── 6. Respond ─────────── */
    return res.status(200).json({
      tasks,
      statusSummary: {
        all: allTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
    try {
        // logic here
        console.log("Task ID param:", req.params.id);
        const task = await Task.findById(req.params.id).populate(
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
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // only overwrite if client sent the field
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      todoChecklist,
      attachments,
      assignedTo
    } = req.body;

    if (title)         task.title         = title;
    if (description)   task.description   = description;
    if (priority)      task.priority      = priority;
    if (status)        task.status        = status;
    if (dueDate)       task.dueDate       = dueDate;
    if (todoChecklist) task.todoChecklist = todoChecklist;
    if (attachments)   task.attachments   = attachments;

    if (assignedTo) {
      if (!Array.isArray(assignedTo))
        return res.status(400).json({ message: "assignedTo must be an array of user IDs" });
      task.assignedTo = assignedTo;
    }

    const saved = await task.save();
    return res.json({ message: "Task updated successfully", task: saved });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Error updating task", error: err.message });
  }
};


// Delete a task
const mongoose = require("mongoose");

const deleteTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




// Update task status

const updateTaskStatus = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Task ID" });
        }

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.status = req.body.status || task.status;

        if (task.status === "Complete") {
            task.todoChecklist = task.todoChecklist.map((item) => ({
                ...item,
                completed: true
            }));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Task status updated", task });
    } catch (error) {
        res.status(400).json({ message: "Error updating status", error: error.message });
    }
};


// Update task checklist/todo

const updateTaskCheckList = async (req, res) => {
  try {
    /* 1. Validate ID */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    /* 2. Grab checklist from body */
    const { todoChecklist = [] } = req.body;        // default to empty array

    /* 3. Fetch task */
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    /* 4. Auth check: assigned user or admin */
    const isAssigned = task.assignedTo.some(
      (uid) => uid.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update checklist" });
    }

    /* 5. Replace checklist & recalc progress */
    task.todoChecklist = todoChecklist;

    const totalItems     = task.todoChecklist.length;
    const completedCount = task.todoChecklist.filter((i) => i.completed).length;

    task.progress = totalItems
      ? Math.round((completedCount / totalItems) * 100)
      : 0;

    if (task.progress === 100)      task.status = "Completed";
    else if (task.progress > 0)     task.status = "In Progress";
    else                            task.status = "Pending";

    await task.save();

    /* 6. Return updated task (populated) */
    const updatedTask = await Task.findById(task._id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    return res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Error updating checklist", error: error.message });
  }
};


// Admin dashboard data
const getDashboardData = async (req, res) => {
  try {
    // logic here
    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({status: "pending"});
    const completedTasks = await Task.countDocuments({status: "Completed"});
    const overdueTasks = await Task.countDocuments({
    status: {$ne :" Completed"},
    dueDate: {$lt: new Date()},
    });

    const taskStatuses = ["Pending", "In Progress" , "Completed"];
    const taskDistributionRaw = await Task.aggregate([
    {
      $group:{
        _id:"$status",
        count:{ $sum:1 },
      },
    },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status)=>{
    const formattedKey  = status.replace(/\s+/g, "");
    acc[formattedKey] = 
    taskDistributionRaw.find((item) =>item._id === status)?.count || 0;
      return acc;
    },{});
    taskDistribution["All"] = totalTasks;

    const taskPriorities = ["Low" , "Medium" ,"High"];
    const taskPriorityLevelRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1},
        },
      },
    ]);

    const taskPriorityLevels = taskPriorities.reduce((acc , priority)=>{
      acc[priority] = 
      taskPriorityLevelRaw.find((item) =>item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find()
      .sort({createdAt: -1})
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      stastics:{
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts:{
        taskDistribution,
        taskPriorityLevels,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User-specific dashboard data
const getUserDashboardData = async (req, res) => {
    try {
        // logic here
      const userId = req.user._id;

      const totalTasks = await Task.countDocuments({assignedTo: userId});
      const pendingTasks = await Task.countDocuments({assignedTo: userId, status: "pending"});
      const completedTasks = await Task.countDocuments({assignedTo: userId , status: "Completed"});
      const overdueTasks = await Task.countDocuments({
        assignedTo: userId,
        status: { $ne: "Completed" },
        dueDate: { $it: new Date() },
      });

      const taskStatuses = ["pending" , " In Progress" , "Completed"];
      const taskDistributionRaw = await Task.aggregate([
        {$match: {assignedTo: userId}},
        {$group: {_id: "$status", count: {$sum:1}}},
      ]);

      const taskDistribution = taskStatuses.reduce((acc, status) => {
        const formattedKey = status.replace(/\s+/g, "");
        acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
        return acc;
      }, {});
      
      
      const recentTasks = await Task.find({assignedTo: userId})
      .sort({createdAt: -1})
      .limit(10)
      .select("title status priority dueDate createdAt");

      res.status(200).json({
        statistics:{
          totalTasks,
          pendingTasks,
          completedTasks,
          overdueTasks,
        },
        charts: {
          taskDistribution,
          taskPriorityLevels,
        },
        recentTasks,
      });
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

