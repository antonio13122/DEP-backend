const mongoose = require("mongoose");
const boatSchema = new mongoose.Schema({
  broj_broda: { type: Number, required: true, unique: true },
  ime_broda: { type: String, required: true },
  duzina: { type: Number, required: true },
  gaz: { type: Number, required: true },
  vrsta_broda: {
    type: String,
    enum: ["catamaran", "sailboat", "motoryacht", "jet ski"],
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Boat = mongoose.model("Boat", boatSchema);
module.exports = Boat;
