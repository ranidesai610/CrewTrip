const express = require("express");
const Vote = require("../models/Vote");

const router = express.Router();

// Create a vote
router.post("/create", async (req, res) => {
    try {
        const {
            tripId,
            question,
            createdBy,
            options
        } = req.body;

        const vote = new Vote({
            tripId,
            question,
            createdBy,
            options
        });

        await vote.save();

        res.status(201).json({
            message: "Vote created successfully",
            vote
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create vote",
            error: error.message
        });
    }
});

// Get all votes for a trip
router.get("/trip/:tripId", async (req, res) => {
    try {
        const votes = await Vote.find({
            tripId: req.params.tripId
        });

        res.status(200).json({
            votes
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get votes",
            error: error.message
        });
    }
});

// Cast a vote
router.put("/:voteId/vote", async (req, res) => {
    try {
        const {
            userId,
            optionId
        } = req.body;

        const vote = await Vote.findById(req.params.voteId);

        if (!vote) {
            return res.status(404).json({
                message: "Vote not found"
            });
        }

        const option = vote.options.id(optionId);

        if (!option) {
            return res.status(404).json({
                message: "Option not found"
            });
        }

        const alreadyVoted = vote.options.some((option) =>
            option.voters.some((voter) =>
                voter.toString() === userId
            )
        );

        if (alreadyVoted) {
            return res.status(400).json({
                message: "User has already voted"
            });
        }

        option.voters.push(userId);

        await vote.save();

        res.status(200).json({
            message: "Vote recorded successfully",
            vote
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cast vote",
            error: error.message
        });
    }
});

// Get voting results
router.get("/:voteId/results", async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.voteId);

        if (!vote) {
            return res.status(404).json({
                message: "Vote not found"
            });
        }

        const results = vote.options.map((option) => ({
            option: option.text,
            votes: option.voters.length
        }));

        res.status(200).json({
            question: vote.question,
            results
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get voting results",
            error: error.message
        });
    }
});

module.exports = router;