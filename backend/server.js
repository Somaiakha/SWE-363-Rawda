// backend/server.js
const express    = require("express");
const dotenv     = require("dotenv");
const cors       = require("cors");
const morgan     = require("morgan");
const connectDB  = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());
app.use(morgan("dev"));

// ─── Routes ───────────────────────────────────────────────────────────────────
const authRoutes     = require("./routes/auth");
const userRoutes     = require("./routes/users");
const questionRoutes = require("./routes/questions");
const guideRoutes    = require("./routes/guides");
const adminRoutes    = require("./routes/admin");
const expertRoutes   = require("./routes/experts");
const forumRoutes    = require("./routes/forum");
const reviewRoutes   = require("./routes/reviews");
const chatRoutes     = require("./routes/chat");
const subscriptionRoutes = require("./routes/subscriptions");
const badgeRoutes        = require("./routes/badges");
const productRoutes = require("./routes/products");

app.use("/api/products",  productRoutes);
app.use("/api/auth",      authRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/guides",    guideRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/experts",   expertRoutes);
app.use("/api/forum",     forumRoutes);
app.use("/api/reviews",   reviewRoutes);
app.use("/api/chat",      chatRoutes);
app.use("/api/services", require("./routes/services"));
app.use("/api/stores", require("./routes/stores"));
// server.js


app.use(
"/api/service-requests",
require("./routes/serviceRequests")
);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/badges", badgeRoutes);

app.get("/", (req, res) => res.send("Rawda API is running 🌿"));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));