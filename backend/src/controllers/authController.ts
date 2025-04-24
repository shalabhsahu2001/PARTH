import { Request, Response } from 'express';
import User from '../models/User';
import { rmSync } from 'fs';

//handle user registration
export const registerUser = async (req: Request, res: Response): Promise<any> => {
  console.log('Incoming data:', req.body); // Log the incoming data

  const { name, email, password, licensePlate } = req.body;
//check for existing user
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
//create new user
    const user = new User({ name, email, password, licensePlate });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err); // Log the error if it occurs
    return res.status(500).json({ error: 'Server error' });
  }
};

//handle user login

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const {email, password} = req.body;

  //find user
  const user = await User.findOne({email});
  if(!user) {
    return res.status(400).json({message: 'Invalid email or password'});
  }
  if(user.password !== password) {
    return res.status(400).json({message: 'Invalid email or password'});
  }
res.status(200).json({message: 'Login Successful', user});
};
