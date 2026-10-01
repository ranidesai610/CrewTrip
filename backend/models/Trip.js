
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    tripName: {
        type: String,
        required: true
    },

    destination: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    totalBudget: {
        type: Number,
        default: 0
    },

    spentAmount: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    inviteCode: {
        type: String,
        required: true,
        unique: true
    },

    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    timeline: [
        {
            title: {
                type: String,
                required: true
            },

            date: {
                type: Date,
                required: true
            },

            description: {
                type: String
            }
        }
    ]
});

module.exports = mongoose.model("Trip", tripSchema);

