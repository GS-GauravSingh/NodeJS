import express from 'express'
import { handleUserSignup, handleUserLogin } from '../controllers/userController.js';

// This file contains Routes specific to User.
const router = express.Router();


// POST Route
router.post('/signup', handleUserSignup)
router.post('/login', handleUserLogin)


// Export the router.
export default router;