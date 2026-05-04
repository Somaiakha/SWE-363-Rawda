const Question = require("../models/Question");
exports.getReportedPosts = async (req, res) => {
    try {
        const posts = await Question.find({ reports: { $gt: 0 } })
            .sort({ reports: -1 });

        res.status(200).json(posts);
    } catch {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted" });
    } catch {
        res.status(400).json({ message: "Error deleting post" });
    }
};

exports.resolvePost = async (req, res) => {
    try {
        const post = await Question.findByIdAndUpdate(
            req.params.id,
            { reports: 0, status: "Active" },
            { new: true }
        );

        res.status(200).json(post);
    } catch {
        res.status(400).json({ message: "Error updating post" });
    }
};