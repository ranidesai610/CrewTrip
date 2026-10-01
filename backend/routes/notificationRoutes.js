const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// Create notification
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            userId,
            message
        } = req.body;

        const notification = new Notification({
            tripId,
            userId,
            message
        });

        await notification.save();

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
});

// Get notifications for a user
router.get("/user/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get notifications",
            error: error.message
        });
    }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update notification",
            error: error.message
        });
    }
});

// Delete notification
router.delete("/:id", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete notification",
            error: error.message
        });
    }
});

module.exports = router;