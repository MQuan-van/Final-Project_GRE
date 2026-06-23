const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    scooterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scooter",
      default: null
    },
    order: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

milestoneSchema.index({ order: 1 });

module.exports = mongoose.model("Milestone", milestoneSchema);