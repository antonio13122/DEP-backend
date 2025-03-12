const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const verifyToken = require("../routes/boatRoutes.js");

router.get("/", verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find().populate("reservation");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payments" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { reservation, amount, payment_option } = req.body;

    const payment = new Payment({
      reservation,
      amount,
      payment_option,
      status: "Completed",
    });
    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Error processing payment" });
  }
});

module.exports = router;
