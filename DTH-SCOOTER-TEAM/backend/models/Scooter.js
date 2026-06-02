const mongoose = require("mongoose");

const scooterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    version: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);

scooterSchema.virtual("images", {
  ref: "ScooterImage",
  localField: "_id",
  foreignField: "scooterId"
});

module.exports = mongoose.model("Scooter", scooterSchema);
