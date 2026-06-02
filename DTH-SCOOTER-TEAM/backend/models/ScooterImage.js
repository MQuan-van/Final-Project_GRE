const mongoose = require("mongoose");

const scooterImageSchema = new mongoose.Schema(
  {
    scooterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scooter",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ScooterImage", scooterImageSchema);
