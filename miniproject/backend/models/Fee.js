const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paid: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.amount;
        },
        message: "Paid amount cannot exceed the total fee",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);