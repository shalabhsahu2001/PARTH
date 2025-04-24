import express from 'express';
import { loginUser, registerUser } from '../controllers/authController';

const router = express.Router();

// Make sure the registerUser function is passed correctly
router.post('/register', registerUser);

//login
router.post('/login', loginUser);

export default router;
