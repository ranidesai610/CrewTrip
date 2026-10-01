const express = require("express");
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
console.log("Expense model:", Expense);

const router = express.Router();

// Add a new expense
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            title,
            amount,
            paidBy,
            splitType,
            splits
        } = req.body;

        const trip = await Trip.findById(tripId);

if (!trip) {
    return res.status(404).json({
        message: "Trip not found"
    });
}

     let finalSplits = splits || [];

if (splitType === "equal") {
    const equalAmount = amount / trip.members.length;

    finalSplits = trip.members.map((member) => ({
        userId: member,
        amount: equalAmount
    }));

}

if (splitType === "percentage") {
    finalSplits = splits.map((split) => ({
        userId: split.userId,
        percentage: split.percentage,
        amount: (amount * split.percentage) / 100
    }));
}

if (splitType === "custom") {
    finalSplits = splits.map((split) => ({
        userId: split.userId,
        amount: split.amount
    }));
}

        const expense = new Expense({
            tripId,
            title,
            amount,
            paidBy,
            splitType,
            splits: finalSplits
        });

        await expense.save();
        const tripBudget = await Trip.findById(tripId);

tripBudget.spentAmount += Number(amount);

await tripBudget.save();

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            message: "Expense creation failed",
            error: error.message
        });
    }
});

// Get all expenses for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const expenses = await Expense.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            expenses
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get expenses",
            error: error.message
        });
    }
});

// Approve an expense
router.put("/:id/approve", async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        expense.approvalStatus = "approved";

        await expense.save();

        res.status(200).json({
            message: "Expense approved successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to approve expense",
            error: error.message
        });
    }
});

// Reject an expense
router.put("/:id/reject", async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        expense.approvalStatus = "rejected";

        await expense.save();

        res.status(200).json({
            message: "Expense rejected successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject expense",
            error: error.message
        });
    }
});

module.exports = router;