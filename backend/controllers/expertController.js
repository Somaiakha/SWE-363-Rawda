const User = require("../models/User");
const mongoose = require("mongoose");

exports.getExpertApplications = async (req, res) => {
    try {
        const experts = await User.find({ role: "expert" })
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(experts);
    } catch (error) {
        res.status(500).json({ message: "Failed to get expert applications" });
    }
};

exports.updateExpertStatus = async (req, res) => {
    try {
        const newStatus = req.body.expertStatus;

        if (!newStatus) {
            return res.status(400).json({ message: "expertStatus is required" });
        }

        const result = await User.collection.updateOne(
            { _id: new mongoose.Types.ObjectId(req.params.id) },
            { $set: { expertStatus: newStatus } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Expert not found" });
        }

        const updatedExpert = await User.findById(req.params.id).select("-password");

        res.status(200).json(updatedExpert);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update expert status",
            error: error.message,
        });
    }
};

exports.deleteExpert = async (req, res) => {
    try {
        const expert = await User.findByIdAndDelete(req.params.id);

        if (!expert) {
            return res.status(404).json({ message: "Expert not found" });
        }

        res.status(200).json({ message: "Expert deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid expert ID" });
    }
};