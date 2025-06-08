const mockDB = require('../models/mockData');

const getCoins = (req, res) => {
  try {
    const userData = mockDB.getUserData();
    res.json({
      success: true,
      totalCoins: userData.totalCoins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coin data' });
  }
};

const addCoins = (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid coin amount' });
    }
    
    const userData = mockDB.getUserData();
    const updatedData = mockDB.updateUserData({
      totalCoins: userData.totalCoins + amount
    });
    
    res.json({
      success: true,
      message: `Added ${amount} coins!`,
      totalCoins: updatedData.totalCoins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding coins' });
  }
};

module.exports = {
  getCoins,
  addCoins
};
