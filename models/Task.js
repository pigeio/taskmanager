const mongoose = require("mongoose");
const { applyTimestamps } = require("./User");

const todoschema = new mongoose.Schema({
    text: {type:String , required: false},
    completed:{type:Boolean,default:false},
});

const taskSchema = new mongoose.Schema(
    {
        title: {type: String , required: true},
        description: {type: String},
        priority: {type: String, enum: ["Low", "Medium", "High"], default: "Medium"},
        status: {type: String ,enum: ["pending", "In Progress", "Completed"], default:"pending"},
        dueDate: {type: Date, required: true},
        assignedTo: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
        attachements: [{type: String}],
        todoChecklist: [todoSchema],
        progress: {type: Number, default: 0}

    },
    {timestamps : true}
);

module.exports = mongoose.model("Task", taskSchema);