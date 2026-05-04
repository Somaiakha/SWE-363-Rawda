const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    status: { type: String, default: "Active" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    about: { type: String, default: "" },
    yearsExperience: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    certificates: { type: [String], default: [] },
    expertStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    notifications: { type: [String], default: [] },
    currentBadge: { type: String, default: "None" },
    badgeColor: { type: String, default: "bg-gray-300" }
  },
  { timestamps: true }
);

userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);