const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  stock: {
    type: Number,
    required: true,
    default: 0
  },

  description: {
    type: String
  },

  image: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    default: "In Stock"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);