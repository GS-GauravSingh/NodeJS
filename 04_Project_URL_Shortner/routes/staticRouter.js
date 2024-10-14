import express from 'express'
import URL from '../models/urlModel.js';

// This file contains Routes specific to URL.
const router = express.Router();

// GET Route
router.get('/', async (req, res) => {
    const allURL = await URL.find({});
    return res.render('homePage', {
        urls: allURL
    });
})

// GET Route
router.get('/signup', async (req, res) => {
    return res.render('signUp');
})

router.get('/login', async (req, res) => {
    return res.render('login');
})


// Export the router.
export default router;