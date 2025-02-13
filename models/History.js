const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  mooring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mooring",
    required: true,
  },
  boat: { type: mongoose.Schema.Types.ObjectId, ref: "Boat" },
  action: { type: String, enum: ["arrived", "departured"], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", HistorySchema);
