import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const CoinWallet = ({ refreshTrigger }) => {
  const [coinData, setCoinData] = useState({
    totalCoins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoinData();
  }, [refreshTrigger]);

  const fetchCoinData = async () => {
    try {
      const response = await ApiService.getCoinData();
      if (response.success) {
        setCoinData({
          totalCoins: response.totalCoins
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coin data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-center items-center py-4">
          <div>Loading wallet...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-4xl mr-3 coin-bounce">💰</span>
          <div>
            <div className="text-2xl font-bold">
              {coinData.totalCoins}
            </div>
            <div className="text-yellow-100">Coins Available</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-yellow-100">Wallet Balance</div>
          <div className="text-lg font-medium">
            🪙 {coinData.totalCoins}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-yellow-300">
        <div className="text-sm text-yellow-100">
          💡 Earn coins by solving daily problems!
        </div>
      </div>
    </div>
  );
};

export default CoinWallet;