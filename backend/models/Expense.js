const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    splitType: {
        type: String,
        enum: ["equal", "percentage", "custom"],
        default: "equal"
    },

   splits: [
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        percentage: {
            type: Number
        },

        amount: {
            type: Number
        }
    }
],

    createdAt: {
        type: Date,
        default: Date.now
    },
    approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
}
});

module.exports = mongoose.model("Expense", expenseSchema);