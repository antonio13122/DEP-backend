const express = require("express");
const router = express.Router();
const Mooring = require("../models/Mooring");

// get all
router.get("/", async (req, res) => {
  try {
    const moorings = await Mooring.find().populate("boat");
    res.json(moorings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching moorings" });
  }
});

// get one
router.get("/:id", async (req, res) => {
  try {
    const mooring = await Mooring.findById(req.params.id).populate("boat");
    if (!mooring) return res.status(404).json({ error: "Mooring not found" });
    res.json(mooring);
  } catch (error) {
    res.status(500).json({ error: "Error fetching mooring" });
  }
});

// new
router.post("/", async (req, res) => {
  try {
    const { number, max_gaz } = req.body;
    const mooring = new Mooring({ number, max_gaz });
    await mooring.save();
    res.status(201).json(mooring);
  } catch (error) {
    res.status(500).json({ error: "Error creating mooring" });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const { boat } = req.body; // boat = null to remove, boat = boatId to assign
    const updatedMooring = await Mooring.findByIdAndUpdate(
      req.params.id,
      { boat },
      { new: true }
    ).populate("boat");

    if (!updatedMooring)
      return res.status(404).json({ error: "Mooring not found" });
    res.json(updatedMooring);
  } catch (error) {
    res.status(500).json({ error: "Error updating mooring" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const deletedMooring = await Mooring.findByIdAndDelete(req.params.id);
    if (!deletedMooring)
      return res.status(404).json({ error: "Mooring not found" });
    res.json({ message: "Mooring deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting mooring" });
  }
});

module.exports = router;
