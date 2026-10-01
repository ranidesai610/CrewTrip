const express = require("express");
const Journal = require("../models/Journal");

const router = express.Router();

// Create journal entry
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            userId,
            title,
            content
        } = req.body;

        const journal = new Journal({
            tripId,
            userId,
            title,
            content
        });

        await journal.save();

        res.status(201).json({
            message: "Journal entry created successfully",
            journal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create journal entry",
            error: error.message
        });
    }
});

// Get journal entries for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const journals = await Journal.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            journals
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get journal entries",
            error: error.message
        });
    }
});

// Update journal entry
router.put("/:id", async (req, res) => {
    try {
        const {
            title,
            content
        } = req.body;

        const journal = await Journal.findById(
            req.params.id
        );

        if (!journal) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        journal.title = title;
        journal.content = content;

        await journal.save();

        res.status(200).json({
            message: "Journal entry updated successfully",
            journal
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update journal entry",
            error: error.message
        });
    }
});

// Delete journal entry
router.delete("/:id", async (req, res) => {
    try {
        const journal = await Journal.findByIdAndDelete(
            req.params.id
        );

        if (!journal) {
            return res.status(404).json({
                message: "Journal entry not found"
            });
        }

        res.status(200).json({
            message: "Journal entry deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete journal entry",
            error: error.message
        });
    }
});

module.exports = router;