const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');

router.get('/', streakController.getStreak);
router.post('/complete', streakController.markDayComplete);
router.post('/reset', streakController.resetStreak);

module.exports = router;