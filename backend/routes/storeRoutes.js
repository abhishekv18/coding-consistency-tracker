const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.get('/', storeController.getStoreItems);
router.post('/purchase', storeController.purchaseItem);
router.get('/history', storeController.getPurchaseHistory);

module.exports = router;