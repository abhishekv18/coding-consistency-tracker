import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const StreakTracker = ({ onStreakUpdate }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    completedDays: [],
    lastActivityDate: null
  });
  const [loading, setLoading] = useState(true);
  const [canSolveToday, setCanSolveToday] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      const response = await ApiService.getStreakData();
      if (response.success) {
        setStreakData({
          currentStreak: response.currentStreak,
          longestStreak: response.longestStreak,
          completedDays: response.completedDays || [],
          lastActivityDate: response.lastActivityDate
        });
        
        // Check if user already solved today
        const today = new Date().toISOString().split('T')[0];
        setCanSolveToday(!response.completedDays?.includes(today));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching streak data:', error);
      setLoading(false);
    }
  };

  const handleSolveProblem = async () => {
    setIsUpdating(true);
    try {
      const response = await ApiService.markDayComplete();
      if (response.success) {
        const updatedData = {
          currentStreak: response.currentStreak,
          longestStreak: response.longestStreak,
          completedDays: response.completedDays || [],
          lastActivityDate: response.lastActivityDate
        };
        setStreakData(updatedData);
        setCanSolveToday(false);
        
        if (onStreakUpdate) {
          onStreakUpdate(updatedData);
        }
        
        // Show success message
        alert(`${response.message} You earned ${response.coinsEarned} coins!`);
      } else {
        alert(response.message || 'Failed to update streak');
      }
    } catch (error) {
      console.error('Error updating streak:', error);
      alert('Error updating streak. Please try again.');
    }
    setIsUpdating(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading streak data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
          <span className="text-6xl fire-flicker">🔥</span>
          <div className="ml-4">
            <div className="text-3xl font-bold text-orange-600">
              {streakData.currentStreak}
            </div>
            <div className="text-gray-600">Day Streak</div>
          </div>
        </div>
        
        <div className="flex justify-around mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {streakData.longestStreak}
            </div>
            <div className="text-gray-600">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {streakData.completedDays?.length || 0}
            </div>
            <div className="text-gray-600">Total Days</div>
          </div>
        </div>

        <button
          onClick={handleSolveProblem}
          disabled={!canSolveToday || isUpdating}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            canSolveToday && !isUpdating
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isUpdating ? 'Updating...' : 
           canSolveToday ? 'Solve Today\'s Problem' : 'Problem Solved Today! 🎉'}
        </button>
      </div>
    </div>
  );
};

export default StreakTracker;