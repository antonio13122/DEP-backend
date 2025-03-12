const mongoose = require("mongoose");

const Payment = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  amount: { type: Number, required: true },
  payment_option: { type: String, enum: ["Card", "Cash"], required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", Payment);
