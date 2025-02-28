import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // Stores "YYYY-MM-DD"
    time: { type: String, required: true }, // Stores "hh:mm A"
    mood: { type: String, required: true },
    description: { type: [String], required: true },
    activities: { type: [String], required: true },
  },
  { timestamps: true }
);

const Entry = mongoose.models.Entry || mongoose.model("Entry", entrySchema);

export default Entry;