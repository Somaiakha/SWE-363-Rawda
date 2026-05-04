const express = require("express");
const router = express.Router();

const Badge = require("../models/Badge");
const User = require("../models/User");

// Get badge rules
router.get("/rules", async (req, res) => {
    try {
        const badges = await Badge.find().sort({ createdAt: 1 });
        res.status(200).json(badges);
    } catch (error) {
        res.status(500).json({ message: "Failed to get badge rules" });
    }
});

// Get experts
router.get("/experts", async (req, res) => {
    try {
        const experts = await User.find({ role: "expert" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(experts);
    } catch (error) {
        res.status(500).json({ message: "Failed to get experts" });
    }
});

// Assign badge
router.put("/experts/:id/assign", async (req, res) => {
    try {
        const { currentBadge, badgeColor } = req.body;

        const expert = await User.findById(req.params.id);

        if (!expert) {
            return res.status(404).json({ message: "Expert not found" });
        }

        // ❌ BLOCK if not approved
        if (expert.expertStatus !== "Approved") {
            return res.status(400).json({
                message: "Cannot assign badge to non-approved expert",
            });
        }

        expert.currentBadge = currentBadge;
        expert.badgeColor = badgeColor;

        await expert.save();

        res.status(200).json(expert);
    } catch (error) {
        res.status(400).json({ message: "Failed to assign badge" });
    }
});

// Remove badge
router.put("/experts/:id/remove", async (req, res) => {
    try {
        const expert = await User.findByIdAndUpdate(
            req.params.id,
            {
                currentBadge: "None",
                badgeColor: "bg-gray-300",
            },
            { new: true }
        ).select("-password");

        if (!expert) {
            return res.status(404).json({ message: "Expert not found" });
        }

        res.status(200).json(expert);
    } catch (error) {
        res.status(400).json({ message: "Failed to remove badge" });
    }
});

module.exports = router;