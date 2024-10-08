import express from 'express'
import { handleGenerateNewShortURL, handleGetAnalytics } from '../controllers/urlController.js';

// This file contains Routes specific to URL.
const router = express.Router();

// GET Route
router.get('/analytics/:shortID', handleGetAnalytics)

// POST Route
router.post('/', handleGenerateNewShortURL)


// Export the router.
export default router;