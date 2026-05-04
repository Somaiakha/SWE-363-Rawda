const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "gardener", "expert", "store"],
    default: "gardener"
  },
  status: {
    type: String,
    default: "Active"
  },
  phone: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    default: ""
  }
},
{ timestamps: true }
);

userSchema.methods.comparePassword = async function (enteredPassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);