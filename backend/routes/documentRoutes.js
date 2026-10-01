const express = require("express");
const multer = require("multer");
const path = require("path");
const Document = require("../models/Document");

const router = express.Router();

// File storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

// Upload document
router.post("/upload", upload.single("document"), async (req, res) => {
    try {
        const {
            tripId,
            uploadedBy
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Please select a file"
            });
        }

        const document = new Document({
            tripId,
            uploadedBy,
            fileName: req.file.originalname,
            filePath: req.file.path
        });

        await document.save();

        res.status(201).json({
            message: "Document uploaded successfully",
            document
        });

    } catch (error) {
        res.status(500).json({
            message: "Document upload failed",
            error: error.message
        });
    }
});

// Get documents for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const documents = await Document.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            documents
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get documents",
            error: error.message
        });
    }
});

// Delete document
router.delete("/:id", async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.status(200).json({
            message: "Document deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete document",
            error: error.message
        });
    }
});

module.exports = router;