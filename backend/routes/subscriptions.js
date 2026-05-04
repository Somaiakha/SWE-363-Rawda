const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

router.get("/", async (req, res) => {
    try {
        const plans = await Subscription.find().sort({ createdAt: 1 });
        res.status(200).json(plans);
    } catch {
        res.status(500).json({ message: "Failed to get subscriptions" });
    }
});

router.post("/", async (req, res) => {
    try {
        const plan = await Subscription.create(req.body);
        res.status(201).json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const plan = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!plan) return res.status(404).json({ message: "Plan not found" });

        res.status(200).json(plan);
    } catch {
        res.status(400).json({ message: "Failed to update subscription" });
    }
});

module.exports = router;