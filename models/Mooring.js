const mongoose = require("mongoose");

const mooringSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  max_gaz: { type: Number, required: true },
  boat: { type: mongoose.Schema.Types.ObjectId, ref: "Boat", default: null },
});

const Mooring = mongoose.model("Mooring", mooringSchema);
module.exports = Mooring;
