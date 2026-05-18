const express = require('express');
const router = express.Router();
const { getRecommendation, getRankings, getBulkFeedback } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getRecommendation);
router.get('/rankings', protect, getRankings);
router.post('/bulk-feedback', protect, getBulkFeedback);

module.exports = router;
