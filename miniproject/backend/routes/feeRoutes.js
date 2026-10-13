const express = require("express");
const mongoose = require("mongoose");
const Fee = require("../models/Fee");

const router = express.Router();

// CREATE: Add a fee record
router.post("/", async (req, res) => {
  try {
    const { student, amount, paid } = req.body;

    const fee = await Fee.create({
      student,
      amount,
      paid,
    });

    res.status(201).json({
      message: "Fee record added successfully",
      fee,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ: Get all fee records
router.get("/", async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ: Get one fee record
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid fee ID" });
    }

    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE: Update fee details or payment
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid fee ID" });
    }

    const allowedFields = ["student", "amount", "paid"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const currentFee = await Fee.findById(req.params.id);

    if (!currentFee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    const newAmount =
      updates.amount !== undefined
        ? Number(updates.amount)
        : currentFee.amount;

    const newPaid =
      updates.paid !== undefined
        ? Number(updates.paid)
        : currentFee.paid;

    if (
      !Number.isFinite(newAmount) ||
      !Number.isFinite(newPaid) ||
      newAmount < 0 ||
      newPaid < 0 ||
      newPaid > newAmount
    ) {
      return res.status(400).json({
        message: "Fee amounts must be valid, non-negative numbers, and paid cannot exceed total",
      });
    }

    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Fee record updated successfully",
      fee,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a fee record
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid fee ID" });
    }

    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    res.status(200).json({ message: "Fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;