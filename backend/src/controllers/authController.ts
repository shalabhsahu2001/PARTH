import { Request, Response } from 'express';
import User from '../models/User';

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  console.log('Incoming data:', req.body); // Log the incoming data

  const { name, email, password, licensePlate } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, licensePlate });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err); // Log the error if it occurs
    return res.status(500).json({ error: 'Server error' });
  }
};
