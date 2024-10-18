const express = require('express');
const router = express.Router();
const Feedback = require('./../models/ratingFeedbacks'); 

router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.post('/submit-feedback', async (req, res) => {
    const { name, rating, feedback } = req.body;

    if (!name || !rating || !feedback) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newFeedback = new Feedback({ name, rating, feedback });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
});

router.get('/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); 
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch feedbacks.' });
    }
});

router.get('/average-rating', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        const totalRatings = feedbacks.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = feedbacks.length ? (totalRatings / feedbacks.length).toFixed(2) : 0;
        res.json({ averageRating });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate average rating.' });
    }
});

module.exports = router;
