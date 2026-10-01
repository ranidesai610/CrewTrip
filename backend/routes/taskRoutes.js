const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create task
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            title,
            description,
            assignedTo,
            dueDate
        } = req.body;

        const task = new Task({
            tripId,
            title,
            description,
            assignedTo,
            dueDate
        });

        await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
});

// Get all tasks for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const tasks = await Task.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get tasks",
            error: error.message
        });
    }
});

// Update task status
router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.status = status;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
});

// Delete task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
});

module.exports = router;