const Question = require("../models/Question");

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "name email")
      .populate("answers.author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name email")
      .populate("answers.author", "name email");
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const answerQuestion = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Answer content is required" });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.answers.push({ content, author: req.user.id });
    await question.save();
    res.status(201).json({ message: "Answer added successfully", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const verifyAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.isVerified = true;
    await question.save();
    res.status(200).json({ message: "Answer verified", question });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getQuestions, getQuestionById, answerQuestion, verifyAnswer };