const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        requirement: { type: String, required: true },
        color: { type: String, default: "bg-gray-500" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Badge", badgeSchema);