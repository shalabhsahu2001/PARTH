// backend/src/controllers/slotController.ts
import { Request, Response } from "express";
import Slot from "../models/Slot";
import User from "../models/User";

export const getAllSlots = async (req: Request, res: Response): Promise<any> => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots" });
  }
};

export const bookSlot = async (req: Request, res: Response): Promise<any> => {
  const { slotId, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const slot = await Slot.findOne({ slotId });
    if (!slot) return res.status(404).json({ error: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ error: "Slot already booked" });

    slot.isBooked = true;
    slot.bookedBy = email;
    slot.bookedAt = new Date();
    await slot.save();

    res.json({ message: "Slot booked successfully", slot });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};
