const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
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

            voters: [
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

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;