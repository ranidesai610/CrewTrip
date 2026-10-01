const express = require("express");
const EmergencyContact = require("../models/EmergencyContact");

const router = express.Router();

// Add emergency contact
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            name,
            phone,
            relation
        } = req.body;

        const contact = new EmergencyContact({
            tripId,
            name,
            phone,
            relation
        });

        await contact.save();

        res.status(201).json({
            message: "Emergency contact added successfully",
            contact
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add emergency contact",
            error: error.message
        });
    }
});

// Get emergency contacts for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            contacts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get emergency contacts",
            error: error.message
        });
    }
});

// Update emergency contact
router.put("/:id", async (req, res) => {
    try {
        const {
            name,
            phone,
            relation
        } = req.body;

        const contact = await EmergencyContact.findById(
            req.params.id
        );

        if (!contact) {
            return res.status(404).json({
                message: "Emergency contact not found"
            });
        }

        contact.name = name;
        contact.phone = phone;
        contact.relation = relation;

        await contact.save();

        res.status(200).json({
            message: "Emergency contact updated successfully",
            contact
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update emergency contact",
            error: error.message
        });
    }
});

// Delete emergency contact
router.delete("/:id", async (req, res) => {
    try {
        const contact = await EmergencyContact.findByIdAndDelete(
            req.params.id
        );

        if (!contact) {
            return res.status(404).json({
                message: "Emergency contact not found"
            });
        }

        res.status(200).json({
            message: "Emergency contact deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete emergency contact",
            error: error.message
        });
    }
});

module.exports = router;