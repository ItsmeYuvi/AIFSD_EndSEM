const express = require('express');
const router = express.Router();
const { generateRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, generateRecommendation);

module.exports = router;
