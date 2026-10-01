const express = require("express");
const PackingItem = require("../models/PackingItem");

const router = express.Router();

// Add packing item
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            item,
            assignedTo
        } = req.body;

        const packingItem = new PackingItem({
            tripId,
            item,
            assignedTo
        });

        await packingItem.save();

        res.status(201).json({
            message: "Packing item added successfully",
            packingItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add packing item",
            error: error.message
        });
    }
});

// Get packing checklist for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const packingItems = await PackingItem.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            packingItems
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get packing items",
            error: error.message
        });
    }
});

// Update packed status
router.put("/:id", async (req, res) => {
    try {
        const { packed } = req.body;

        const packingItem = await PackingItem.findById(req.params.id);

        if (!packingItem) {
            return res.status(404).json({
                message: "Packing item not found"
            });
        }

        packingItem.packed = packed;

        await packingItem.save();

        res.status(200).json({
            message: "Packing item updated successfully",
            packingItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update packing item",
            error: error.message
        });
    }
});

// Delete packing item
router.delete("/:id", async (req, res) => {
    try {
        const packingItem = await PackingItem.findByIdAndDelete(req.params.id);

        if (!packingItem) {
            return res.status(404).json({
                message: "Packing item not found"
            });
        }

        res.status(200).json({
            message: "Packing item deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete packing item",
            error: error.message
        });
    }
});

module.exports = router;