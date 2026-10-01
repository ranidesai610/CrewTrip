const express = require("express");
const crypto = require("crypto");
const Trip = require("../models/Trip");

const router = express.Router();

// Create a new trip
router.post("/create", async (req, res) => {
    try {
        const { tripName, destination, startDate, endDate, createdBy } = req.body;

        // Generate a unique invite code
        const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

        const trip = new Trip({
    tripName,
    destination,
    startDate,
    endDate,
    createdBy,
    inviteCode,
    members: [createdBy]
});
        await trip.save();

        res.status(201).json({
            message: "Trip created successfully",
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Trip creation failed",
            error: error.message
        });
    }
});

// Get all trips
router.get("/", async (req, res) => {
    try {
        const trips = await Trip.find();

        res.status(200).json({
            trips
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get trips",
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("members", "name email");

        if (!trip) {

            return res.status(404).json({
                message: "Trip not found"
            });

        }

        const today = new Date();

        const startDate = new Date(trip.startDate);

        const difference =
            startDate.getTime() - today.getTime();

        const countdownDays =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        res.status(200).json({

            _id: trip._id,

            tripName: trip.tripName,

            destination: trip.destination,

            startDate: trip.startDate,

            endDate: trip.endDate,

            totalBudget: trip.totalBudget,

            spentAmount: trip.spentAmount,

            createdBy: trip.createdBy,

            inviteCode: trip.inviteCode,

            members: trip.members,

            timeline: trip.timeline,

            countdownDays: countdownDays

        });

    } catch (error) {

        res.status(500).json({

            message: "Failed to get trip",

            error: error.message

        });

    }

});

// Join a trip using invite code
router.post("/join", async (req, res) => {
    try {
        const { inviteCode, userId } = req.body;

        const trip = await Trip.findOne({ inviteCode });

        if (!trip) {
            return res.status(404).json({
                message: "Invalid invite code"
            });
        }

        if (trip.members.includes(userId)) {
            return res.status(400).json({
                message: "User is already a member of this trip"
            });
        }

        trip.members.push(userId);

        await trip.save();

        res.status(200).json({
            message: "Joined trip successfully",
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to join trip",
            error: error.message
        });
    }
});

router.post("/:id/timeline", async (req, res) => {
    try {
        const { title, date, description } = req.body;

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        trip.timeline.push({
            title,
            date,
            description
        });

        await trip.save();

        res.status(201).json({
            message: "Timeline event added successfully",
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add timeline event",
            error: error.message
        });
    }
});

// Get timeline events for a trip
router.get("/:id/timeline", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.status(200).json({
            timeline: trip.timeline
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get timeline",
            error: error.message
        });
    }
});

// Set trip budget
router.put("/:id/budget", async (req, res) => {
    try {
        const { totalBudget } = req.body;

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        trip.totalBudget = totalBudget;

        await trip.save();

        res.status(200).json({
            message: "Trip budget updated successfully",
            trip
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update trip budget",
            error: error.message
        });
    }
});

// Get budget progress
router.get("/:id/budget", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        const remainingAmount =
            trip.totalBudget - trip.spentAmount;

        let progressPercentage = 0;

        if (trip.totalBudget > 0) {
            progressPercentage =
                (trip.spentAmount / trip.totalBudget) * 100;
        }

        res.status(200).json({
            totalBudget: trip.totalBudget,
            spentAmount: trip.spentAmount,
            remainingAmount: remainingAmount,
            progressPercentage: progressPercentage
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get budget progress",
            error: error.message
        });
    }
});
module.exports = router;