import express from 'express';
import { registerUser } from '../controllers/authController';

const router = express.Router();

// Make sure the registerUser function is passed correctly
router.post('/register', registerUser);

export default router;
