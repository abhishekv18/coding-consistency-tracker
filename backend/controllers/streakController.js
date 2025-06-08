const mockDB = require('../models/mockData');
const { isToday, getTodayString, calculateStreakFromDates } = require('../utils/dateHelpers');

const getStreak = (req, res) => {
  try {
    const userData = mockDB.getUserData();
    res.json({
      success: true,
      currentStreak: userData.currentStreak,
      longestStreak: userData.longestStreak,
      completedDays: userData.completedDays,
      lastActivityDate: userData.lastActivityDate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching streak data' });
  }
};

const markDayComplete = (req, res) => {
  try {
    const userData = mockDB.getUserData();
    const today = getTodayString();
    
    
    if (userData.completedDays.includes(today)) {
      return res.json({
        success: false,
        message: 'Already completed today!',
        data: userData
      });
    }
    
   
    const updatedCompletedDays = [...userData.completedDays, today];
 
    const newStreak = calculateStreakFromDates(updatedCompletedDays);
    
   
    let coinsEarned = 10;
    if (newStreak % 7 === 0) coinsEarned += 20; 
    if (newStreak % 30 === 0) coinsEarned += 50; 
    
   
    const updatedData = mockDB.updateUserData({
      completedDays: updatedCompletedDays,
      currentStreak: newStreak,
      longestStreak: Math.max(userData.longestStreak, newStreak),
      totalCoins: userData.totalCoins + coinsEarned,
      lastActivityDate: today
    });
    
    res.json({
      success: true,
      message: `Great job! +${coinsEarned} coins earned!`,
      currentStreak: updatedData.currentStreak,
      longestStreak: updatedData.longestStreak,
      completedDays: updatedData.completedDays,
      lastActivityDate: updatedData.lastActivityDate,
      coinsEarned
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking day complete' });
  }
};

const resetStreak = (req, res) => {
  try {
    const updatedData = mockDB.updateUserData({
      currentStreak: 0,
      completedDays: []
    });
    
    res.json({
      success: true,
      message: 'Streak reset successfully',
      currentStreak: updatedData.currentStreak,
      longestStreak: updatedData.longestStreak,
      completedDays: updatedData.completedDays,
      lastActivityDate: updatedData.lastActivityDate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting streak' });
  }
};

module.exports = {
  getStreak,
  markDayComplete,
  resetStreak
};