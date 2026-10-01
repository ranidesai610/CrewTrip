const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Send a message
router.post("/send", async (req, res) => {
    try {
        const {
            tripId,
            userId,
            message
        } = req.body;

        const newMessage = new Message({
            tripId,
            userId,
            message
        });

        await newMessage.save();

        res.status(201).json({
            message: "Message sent successfully",
            chatMessage: newMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to send message",
            error: error.message
        });
    }
});

// Get all messages for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const messages = await Message.find({
            tripId: req.params.tripId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            messages
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get messages",
            error: error.message
        });
    }
});

// Delete a message
router.delete("/:id", async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json({
            message: "Message deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete message",
            error: error.message
        });
    }
});

module.exports = router;