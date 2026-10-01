const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    available: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Availability", availabilitySchema);