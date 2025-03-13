const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const boatRoutes = require("./routes/boatRoutes");
const MooringRoutes = require("./routes/MooringRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

dotenv.config();
const app = express();

// Check if JWT_SECRET is present in the environment
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in the environment variables");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/boats", boatRoutes);
app.use("/api/boats/all", boatRoutes);
app.use("/api/moorings", MooringRoutes);
app.use("/api/reservations", reservationRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
