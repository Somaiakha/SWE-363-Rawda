// backend/controllers/serviceRequestController.js

const ServiceRequest =
require("../models/ServiceRequest");

/* GET ALL */
exports.getRequests =
async (req, res) => {
  try {
    const data =
      await ServiceRequest.find()
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/* CREATE */
exports.createRequest =
async (req, res) => {
  try {
    const data =
      await ServiceRequest.create(
        req.body
      );

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

/* UPDATE */
exports.updateRequest =
async (req, res) => {
  try {
    const data =
      await ServiceRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(data);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

/* DELETE */
exports.deleteRequest =
async (req, res) => {
  try {
    await ServiceRequest.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
      "Deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};