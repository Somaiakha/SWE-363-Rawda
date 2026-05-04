const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  pricePerDay: {
    type: Number,
    required: true
  },

  startDate: {
    type: String,
    required: true
  },

  endDate: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Active"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);