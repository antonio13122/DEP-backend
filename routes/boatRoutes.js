const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const Boat = require("../models/Boat");

const router = express.Router();

//  Create a new boat
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { broj_broda, ime_broda, duzina, gaz, vrsta_broda } = req.body;

    if (!broj_broda || !ime_broda || !duzina || !gaz || !vrsta_broda) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBoat = new Boat({
      broj_broda,
      ime_broda,
      duzina,
      gaz,
      vrsta_broda,
      owner: req.user.id,
    });

    await newBoat.save();
    res.status(201).json(newBoat);
  } catch (error) {
    console.error("Error creating boat:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const boats = await Boat.find({ owner: req.user.id });
    res.status(200).json(boats);
  } catch (error) {
    console.error("Error fetching boats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
