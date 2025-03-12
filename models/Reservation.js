const mongoose = require("mongoose");

const Reservation = new mongoose.Schema({
  boat: { type: mongoose.Schema.Types.ObjectId, ref: "Boat", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mooring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mooring",
    required: true,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reservation", Reservation);
