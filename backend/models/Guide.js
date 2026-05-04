const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        submittedBy: { type: String, required: true },
        category: { type: String, default: "General" },
        references: { type: [String], default: [] },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Revision", "Rejected"],
            default: "Pending",
        },
        feedbackNote: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Guide", guideSchema);