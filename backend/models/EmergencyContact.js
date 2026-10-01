const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    relation: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const EmergencyContact = mongoose.model(
    "EmergencyContact",
    emergencyContactSchema
);

module.exports = EmergencyContact;