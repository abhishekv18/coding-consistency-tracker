const express = require('express');
const router = express.Router();
const coinController = require('../controllers/coinController');

router.get('/', coinController.getCoins);
router.post('/add', coinController.addCoins);

module.exports = router;