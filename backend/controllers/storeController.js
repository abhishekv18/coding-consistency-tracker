const mockDB = require('../models/mockData');

const getStoreItems = (req, res) => {
  try {
    const items = mockDB.getStoreItems();
    const userData = mockDB.getUserData();
    
    res.json({
      success: true,
      items,
      userCoins: userData.totalCoins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching store items' });
  }
};

const purchaseItem = (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID required' });
    }
    
    const purchase = mockDB.purchaseItem(itemId);
    
    if (!purchase) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient coins or item not found' 
      });
    }
    
    const userData = mockDB.getUserData();
    
    res.json({
      success: true,
      message: `Successfully purchased ${purchase.itemName}!`,
      purchase,
      remainingCoins: userData.totalCoins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error purchasing item' });
  }
};

const getPurchaseHistory = (req, res) => {
  try {
    const history = mockDB.getPurchaseHistory();
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching purchase history' });
  }
};

module.exports = {
  getStoreItems,
  purchaseItem,
  getPurchaseHistory
};