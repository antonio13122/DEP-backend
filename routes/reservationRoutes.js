const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");

router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().populate(
      "boat owner mooring"
    );
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reservations" });
  }
});

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

module.exports = router;
