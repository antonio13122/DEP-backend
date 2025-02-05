const express = require("express");
const Boat = require("../models/Boat");
const jwt = require("jsonwebtoken");
const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", "").trim(),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Get all boats
router.get("/all", async (req, res) => {
  try {
    const boats = await Boat.find().populate("user", "name email"); // Populate user info
    res.json(boats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Get all boats
router.get("/", verifyToken, async (req, res) => {
  try {
    const boats = await Boat.find({ user: req.user.id });
    res.json(boats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new boat
router.post("/", verifyToken, async (req, res) => {
  try {
    const { broj_broda, ime_broda, duzina, gaz, vrsta_broda } = req.body;
    const newBoat = new Boat({
      broj_broda,
      ime_broda,
      duzina,
      gaz,
      vrsta_broda,
      user: req.user.id,
    });

    await newBoat.save();
    res.status(201).json(newBoat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

//  Get a single boat by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const boat = await Boat.findOne({ _id: req.params.id, user: req.user.id });

    if (!boat) return res.status(404).json({ message: "Boat not found" });

    res.json(boat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a boat
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedBoat = await Boat.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedBoat)
      return res.status(404).json({ message: "Boat not found" });

    res.json({ message: "Boat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
