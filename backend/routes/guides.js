const express = require("express");
const router = express.Router();
const Guide = require("../models/Guide");

router.get("/", async (req, res) => {
    try {
        const guides = await Guide.find().sort({ createdAt: -1 });
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: "Failed to get guides" });
    }
});

router.post("/", async (req, res) => {
    try {
        const guide = await Guide.create(req.body);
        res.status(201).json(guide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id/status", async (req, res) => {
    try {
        const { approvalStatus, feedbackNote } = req.body;

        const guide = await Guide.findByIdAndUpdate(
            req.params.id,
            { approvalStatus, feedbackNote },
            { new: true, runValidators: true }
        );

        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        res.status(200).json(guide);
    } catch (error) {
        res.status(400).json({ message: "Failed to update guide" });
    }
});

module.exports = router;