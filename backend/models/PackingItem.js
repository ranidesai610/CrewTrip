const mongoose = require("mongoose");

const packingItemSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    item: {
        type: String,
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    packed: {
        type: Boolean,
        default: false
    }
});

const PackingItem = mongoose.model("PackingItem", packingItemSchema);

module.exports = PackingItem;