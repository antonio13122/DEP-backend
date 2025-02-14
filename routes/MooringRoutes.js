const express = require("express");
const router = express.Router();
const Mooring = require("../models/Mooring");
const Boat = require("../models/Boat");
const History = require("../models/History");

// all moorings
router.get("/", async (req, res) => {
  try {
    const moorings = await Mooring.find().populate("boat");
    res.json(moorings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching moorings" });
  }
});

// single mooring
router.get("/:id", async (req, res) => {
  try {
    const mooring = await Mooring.findById(req.params.id).populate("boat");
    if (!mooring) return res.status(404).json({ error: "Mooring not found" });
    res.json(mooring);
  } catch (error) {
    res.status(500).json({ error: "Error fetching mooring" });
  }
});

//  new mooring
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

// update mooring
router.put("/:id", async (req, res) => {
  try {
    const { boat } = req.body;
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

// delete mooring
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

// add boat

router.post("/:id/add", async (req, res) => {
  try {
    const { boatId } = req.body;

    const existingMooring = await Mooring.findOne({ boat: boatId });
    if (existingMooring) {
      return res
        .status(400)
        .json({ error: "This boat already has a mooring!" });
    }

    const updatedMooring = await Mooring.findByIdAndUpdate(
      req.params.id,
      { boat: boatId },
      { new: true }
    ).populate("boat");

    if (!updatedMooring) {
      return res.status(404).json({ error: "Mooring not found" });
    }

    await History.create({
      mooring: req.params.id,
      boat: boatId,
      action: "arrived",
    });

    res.json(updatedMooring);
  } catch (error) {
    res.status(500).json({ error: "Error adding boat to mooring" });
  }
});

// remove a boat from a mooring
router.post("/:id/remove", async (req, res) => {
  try {
    const mooring = await Mooring.findById(req.params.id).populate("boat");
    if (!mooring) return res.status(404).json({ error: "Mooring not found" });

    const removedBoatId = mooring.boat ? mooring.boat._id : null;

    const updatedMooring = await Mooring.findByIdAndUpdate(
      req.params.id,
      { boat: null },
      { new: true }
    ).populate("boat");

    // Save history
    if (removedBoatId) {
      await History.create({
        mooring: req.params.id,
        boat: removedBoatId,
        action: "departured",
      });
    }

    res.json(updatedMooring);
  } catch (error) {
    res.status(500).json({ error: "Error removing" });
  }
});

// get all history logs
router.get("/history/all", async (req, res) => {
  try {
    const history = await History.find()
      .populate("mooring", "number")
      .populate("boat", "ime_broda vrsta_broda");
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Error fetching " });
  }
});

module.exports = router;
