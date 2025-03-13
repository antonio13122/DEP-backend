const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const verifyToken = require("../middleware/auth");

router.post("/", async (req, res) => {
  try {
    const { boat, owner, mooring } = req.body;

    const reservation = new Reservation({
      boat,
      owner,
      mooring,
      date: new Date(),
    });
    await reservation.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: "Error creating reservation" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const reservations = await Reservation.find({ owner: userId }).populate(
      "boat owner mooring"
    );

    if (reservations.length === 0) {
      return res.status(404).json({ message: "No reservations found" });
    }

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Error fetching reservations" });
  }
});
module.exports = router;
