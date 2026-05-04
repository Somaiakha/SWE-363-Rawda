const express  = require("express");
const router   = express.Router();
const Question = require("../models/Question");
const { protect } = require("../middleware/auth");

// GET all questions - populate author name
router.get("/", async (req, res) => {
  try {
    let query = Question.find().populate("author", "name").sort({ createdAt: -1 });
    if (req.query.tag)    query = query.where("tags").in([req.query.tag]);
    if (req.query.search) query = query.where("title", new RegExp(req.query.search, "i"));
    const questions = await query;
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to get questions" });
  }
});

// GET single question by id - populate author and answer authors
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name")
      .populate("answers.author", "name");
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (error) {
    res.status(404).json({ message: "Question not found" });
  }
});

// POST create question - requires auth, author set from token
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const question = await Question.create({
      title,
      content,
      tags: tags || [],
      author: req.user.id,
    });
    const populated = await question.populate("author", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST add answer to a question - requires auth
router.post("/:id/answers", protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    question.answers.push({ content: req.body.content, author: req.user.id });
    await question.save();
    await question.populate("author", "name");
    await question.populate("answers.author", "name");
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST like/unlike a question
router.post("/:id/like", protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    question.likes = (question.likes || 0) + 1;
    await question.save();
    res.json({ likes: question.likes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST toggle bookmark on a question
router.post("/:id/bookmark", protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    const userId   = req.user.id;
    const idx      = question.bookmarks.findIndex((b) => b.toString() === userId);
    const bookmarked = idx === -1;
    if (bookmarked) question.bookmarks.push(userId);
    else            question.bookmarks.splice(idx, 1);
    await question.save();
    res.json({ bookmarked });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
