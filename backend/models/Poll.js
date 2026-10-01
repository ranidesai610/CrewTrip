const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    question: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    options: [
        {
            text: {
                type: String,
                required: true
            },

            votes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ]
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Poll", pollSchema);