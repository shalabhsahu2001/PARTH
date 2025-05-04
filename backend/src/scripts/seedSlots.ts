import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Slot from '../models/Slot';

dotenv.config();

const sections = {
  A: ['A-1', 'A-2', 'A-3'],
  B: ['B-1', 'B-2'],
  C: ['C-1', 'C-2'],
  D: ['D-1', 'D-2'],
};

const seedSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');

    await Slot.deleteMany(); // Optional: Clear existing slots

    const slots: { slotId: string }[] = [];


    for (const section in sections) {
      sections[section as keyof typeof sections].forEach(slotId => {
        slots.push({ slotId });
      });
    }

    await Slot.insertMany(slots);
    console.log('Slots seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding slots:', error);
    process.exit(1);
  }
};

seedSlots();
