const mongoose = require("mongoose");

const teamStorySchema = new mongoose.Schema(
  {
    founderName: { type: String, required: true, trim: true },
    founderImage: { type: String, required: true, trim: true },
    founderBirthday: { type: String, required: true, trim: true },
    story: {
      title: { type: String, required: true, trim: true },
      content: { type: String, required: true, trim: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamStory", teamStorySchema);