const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        features: { type: [String], default: [] },
        activeUsers: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);