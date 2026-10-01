const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    fileName: {
        type: String,
        required: true
    },

    filePath: {
        type: String,
        required: true
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;