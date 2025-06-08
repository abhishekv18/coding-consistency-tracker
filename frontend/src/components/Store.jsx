// frontend/src/components/Store.jsx
import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const Store = ({ onPurchase }) => {
  const [storeItems, setStoreItems] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('store');
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    fetchStoreData();
    fetchPurchaseHistory();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await ApiService.getStoreItems();
      if (response.success) {
        setStoreItems(response.items || []);
        setUserCoins(response.userCoins || 0);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching store data:', error);
      setLoading(false);
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      const response = await ApiService.getPurchaseHistory();
      if (response.success) {
        setPurchaseHistory(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    }
  };

  const handlePurchase = async (itemId, itemPrice, itemName) => {
    if (userCoins < itemPrice) {
      alert('Not enough coins!');
      return;
    }

    try {
      const response = await ApiService.purchaseItem(itemId);
      if (response.success) {
        alert(`Successfully purchased ${itemName}!`);
        setUserCoins(response.remainingCoins);
        fetchPurchaseHistory();
        onPurchase && onPurchase();
      } else {
        alert(response.message || 'Purchase failed!');
      }
    } catch (error) {
      console.error('Error making purchase:', error);
      alert('Purchase failed! Please try again.');
    }
  };

  const StoreItem = ({ item }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
      <div className="text-center mb-3">
        <div className="text-4xl mb-2">{item.icon}</div>
        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="text-yellow-600 font-bold text-lg mb-3">
          🪙 {item.price} coins
        </div>
        <button
          onClick={() => handlePurchase(item.id, item.price, item.name)}
          disabled={userCoins < item.price}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            userCoins >= item.price
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {userCoins >= item.price ? 'Purchase' : 'Not Enough Coins'}
        </button>
      </div>
    </div>
  );

  const PurchaseHistoryItem = ({ purchase }) => (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl mr-3">🛒</div>
          <div>
            <h4 className="font-medium text-gray-800">{purchase.itemName}</h4>
            <p className="text-gray-600 text-sm">
              Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-yellow-600 font-bold">
            🪙 {purchase.price}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center p-8">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setSelectedTab('store')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'store'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🛒 Store
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`px-4 py-2 font-medium ml-6 ${
            selectedTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📋 Purchase History
        </button>
      </div>

      <div className="mb-4 text-center">
        <div className="inline-flex items-center bg-yellow-100 px-4 py-2 rounded-lg">
          <span className="text-2xl mr-2">💰</span>
          <span className="font-bold text-yellow-800">
            {userCoins} coins available
          </span>
        </div>
      </div>

      {selectedTab === 'store' ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🛍️ Coding Store
          </h2>
          
          {storeItems.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No items available in the store.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storeItems.map((item) => (
                <StoreItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📋 Purchase History
          </h2>
          
          {purchaseHistory.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No purchases yet. Start shopping to see your history!
            </div>
          ) : (
            <div className="space-y-4">
              {purchaseHistory
                .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
                .map((purchase) => (
                  <PurchaseHistoryItem key={purchase.id} purchase={purchase} />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Store;