const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");

const users = [
  { name: "Raghada", email: "Raghada@gmail.com", password: "123456", role: "admin" },
  { name: "Somaia",  email: "Somaia@gmail.com",  password: "123456", role: "expert", yearsExperience: 8, bio: "Plant care specialist", expertStatus: "Approved" },
  { name: "Sadeem",  email: "Sadeem@gmail.com",  password: "123456", role: "gardener" },
  { name: "Anwar",   email: "Anwar@gmail.com",   password: "123456", role: "store" },
];

async function seed() {
  await connectDB();

  for (const u of users) {
    await User.deleteOne({ email: u.email });
    await User.create(u);
    console.log(`Created: ${u.email} (${u.role})`);
  }

  console.log("Done.");
  process.exit(0);
}

seed();
