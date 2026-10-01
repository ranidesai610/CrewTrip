
const express = require("express");
const Poll = require("../models/Poll");

const router = express.Router();

// =============================
// Create a poll
// =============================

router.post("/create", async (req, res) => {
    try {

        const {
            tripId,
            question,
            createdBy,
            options
        } = req.body;

        const poll = new Poll({
            tripId,
            question,
            createdBy,
            options
        });

        await poll.save();

        res.status(201).json({
            message: "Poll created successfully",
            poll
        });

    } catch (error) {

        res.status(500).json({
            message: "Poll creation failed",
            error: error.message
        });

    }
});


// =============================
// Get polls for one trip
// =============================

router.get("/trip/:tripId", async (req, res) => {
    try {

        const polls = await Poll.find({
            tripId: req.params.tripId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            polls
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to get trip polls",
            error: error.message
        });

    }
});


// =============================
// Vote on a poll
// =============================

router.put("/:pollId/vote", async (req, res) => {
    try {

        const {
            userId,
            optionId
        } = req.body;

        const poll = await Poll.findById(
            req.params.pollId
        );

        if (!poll) {

            return res.status(404).json({
                message: "Poll not found"
            });

        }

        const option = poll.options.id(
            optionId
        );

        if (!option) {

            return res.status(404).json({
                message: "Option not found"
            });

        }

        // Check if user has already voted

        const alreadyVoted = poll.options.some(
            (pollOption) =>
                pollOption.votes.some(
                    (vote) =>
                        vote.toString() === userId
                )
        );

        if (alreadyVoted) {

            return res.status(400).json({
                message: "User has already voted"
            });

        }

        option.votes.push(userId);

        await poll.save();

        res.status(200).json({
            message: "Vote recorded successfully",
            poll
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to vote",
            error: error.message
        });

    }
});


// =============================
// Get all polls
// =============================

router.get("/", async (req, res) => {
    try {

        const polls = await Poll.find();

        res.status(200).json({
            polls
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to get polls",
            error: error.message
        });

    }
});


// =============================
// Get poll results
// =============================

router.get("/:pollId/results", async (req, res) => {
    try {

        const poll = await Poll.findById(
            req.params.pollId
        );

        if (!poll) {

            return res.status(404).json({
                message: "Poll not found"
            });

        }

        const results = poll.options.map(
            (option) => ({
                option: option.text,
                votes: option.votes.length
            })
        );

        res.status(200).json({
            question: poll.question,
            results
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to get poll results",
            error: error.message
        });

    }
});


module.exports = router;

