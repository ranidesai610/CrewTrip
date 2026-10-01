const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    dueDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;