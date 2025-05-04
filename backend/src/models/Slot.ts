// backend/src/models/Slot.ts
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  slotId: { type: String, required: true, unique: true }, // e.g., "A1", "B3"
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String, ref: "User", default: null },
  bookedAt: { type: Date, default: null },
});

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
