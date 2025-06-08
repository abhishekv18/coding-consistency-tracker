
// import React, { useState, useEffect } from 'react';
// import StreakTracker from './components/StreakTracker';
// import CoinWallet from './components/CoinWallet';
// import Calendar from './components/Calendar';
// import Store from './components/Store';
// import './App.css';

// function App() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [streakData, setStreakData] = useState({
//     currentStreak: 0,
//     longestStreak: 0,
//     completedDays: [],
//     lastActivityDate: null
//   });
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   const handleStreakUpdate = (updatedStreakData) => {
//     setStreakData(updatedStreakData);
//     // Trigger refresh for components that depend on streak/coin data
//     setRefreshTrigger(prev => prev + 1);
//   };

//   const handlePurchase = () => {
//     // Trigger refresh for coin wallet after purchase
//     setRefreshTrigger(prev => prev + 1);
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <StreakTracker onStreakUpdate={handleStreakUpdate} />
//               <CoinWallet refreshTrigger={refreshTrigger} />
//             </div>
//             <Calendar completedDays={streakData.completedDays} />
//           </div>
//         );
//       case 'calendar':
//         return (
//           <div className="max-w-2xl mx-auto">
//             <Calendar completedDays={streakData.completedDays} />
//           </div>
//         );
//       case 'store':
//         return <Store onPurchase={handlePurchase} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">
//                 💻 Coding Consistency Tracker
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-600">
//                 Keep coding, keep growing! 🚀
//               </span>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Navigation */}
//       <nav className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex space-x-8">
//             <button
//               onClick={() => setActiveTab('dashboard')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'dashboard'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               📊 Dashboard
//             </button>
//             <button
//               onClick={() => setActiveTab('calendar')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'calendar'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               📅 Calendar
//             </button>
//             <button
//               onClick={() => setActiveTab('store')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'store'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               🛒 Store
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           {renderContent()}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t mt-12">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="text-center text-gray-600">
//             <p className="text-sm">
//               🎯 Stay consistent, code daily, and build great habits! 
//             </p>
//             <p className="text-xs mt-2">
//               Track your progress • Earn rewards • Level up your skills
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import StreakTracker from './components/StreakTracker';
import CoinWallet from './components/CoinWallet';
import Calendar from './components/Calendar';
import Store from './components/Store';
import ApiService from './services/api'; // Import your API service
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize with null to indicate data hasn't been loaded yet
  const [streakData, setStreakData] = useState(null);
  const [coinData, setCoinData] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Test backend connection and fetch initial data
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Testing backend connection...');
        
        // Test backend connection
        const isConnected = await ApiService.testConnection();
        setBackendConnected(isConnected);
        
        if (isConnected) {
          console.log('✅ Backend connected, fetching data...');
          await fetchAllData();
        } else {
          console.log('❌ Backend not connected, using fallback data');
          setError('Backend connection failed. Using offline mode.');
          // Set fallback data instead of zeros
          setStreakData({
            currentStreak: 0,
            longestStreak: 0,
            completedDays: [],
            lastActivityDate: null
          });
          setCoinData({
            balance: 0,
            totalEarned: 0
          });
        }
      } catch (err) {
        console.error('🔴 Initialization error:', err);
        setError('Failed to connect to backend. Using offline mode.');
        setBackendConnected(false);
        // Set fallback data
        setStreakData({
          currentStreak: 0,
          longestStreak: 0,
          completedDays: [],
          lastActivityDate: null
        });
        setCoinData({
          balance: 0,
          totalEarned: 0
        });
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [refreshTrigger]);

  // Fetch all data from backend
  const fetchAllData = async () => {
    try {
      console.log('📡 Fetching all data from backend...');
      
      // Fetch streak data
      const streakResponse = await ApiService.getStreakData();
      console.log('📊 Streak data received:', streakResponse);
      
      // Map the backend response to your frontend structure
      const mappedStreakData = {
        currentStreak: streakResponse.currentStreak || 0,
        longestStreak: streakResponse.longestStreak || 0,
        completedDays: streakResponse.completedDays || [],
        lastActivityDate: streakResponse.lastActivityDate || null
      };
      
      console.log('📊 Mapped streak data:', mappedStreakData);
      setStreakData(mappedStreakData);
      
      // Fetch coin data
      const coinResponse = await ApiService.getCoinData();
      console.log('💰 Coin data received:', coinResponse);
      
      // Map the backend response to your frontend structure
      const mappedCoinData = {
        balance: coinResponse.totalCoins || coinResponse.balance || 0,
        totalEarned: coinResponse.totalEarned || coinResponse.totalCoins || 0
      };
      
      console.log('💰 Mapped coin data:', mappedCoinData);
      setCoinData(mappedCoinData);
      
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      throw error;
    }
  };
const handleDiagnose = async () => {
  console.log('🔬 Running diagnostics...');
  const results = await ApiService.diagnose();
  
  // Show results in an alert or modal
  alert(`Diagnosis Results:\n${JSON.stringify(results.tests, null, 2)}`);
};
  const handleStreakUpdate = async (updatedStreakData) => {
    console.log('🔄 Streak updated:', updatedStreakData);
    setStreakData(updatedStreakData);
    
    // If backend is connected, sync the data
    if (backendConnected) {
      try {
        // Refresh coin data as completing streaks might award coins
        const coinResponse = await ApiService.getCoinData();
        const mappedCoinData = {
          balance: coinResponse.totalCoins || coinResponse.balance || 0,
          totalEarned: coinResponse.totalEarned || coinResponse.totalCoins || 0
        };
        setCoinData(mappedCoinData);
        console.log('💰 Coin data refreshed after streak update:', mappedCoinData);
      } catch (error) {
        console.error('❌ Error syncing coin data after streak update:', error);
      }
    }
    
    // Trigger refresh for other components
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePurchase = async () => {
    console.log('🛒 Purchase completed, refreshing data...');
    
    if (backendConnected) {
      try {
        // Refresh coin data after purchase
        const coinResponse = await ApiService.getCoinData();
        const mappedCoinData = {
          balance: coinResponse.totalCoins || coinResponse.balance || 0,
          totalEarned: coinResponse.totalEarned || coinResponse.totalCoins || 0
        };
        setCoinData(mappedCoinData);
        console.log('💰 Coin data refreshed after purchase:', mappedCoinData);
      } catch (error) {
        console.error('❌ Error refreshing coin data after purchase:', error);
      }
    }
    
    // Trigger refresh for coin wallet
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRetryConnection = () => {
    console.log('🔄 Retrying backend connection...');
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    // Show loading until we have data
    if (loading || !streakData || !coinData) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {loading ? 'Connecting to backend...' : 'Loading your progress...'}
            </p>
            {error && (
              <p className="text-sm text-gray-500 mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Connection Issue
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleRetryConnection}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-md transition-colors"
                      >
                        🔄 Retry Connection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
            
            {/* Connection Status */}
            {/* <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  <span className="text-sm font-medium">
                    Backend Status: {backendConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {backendConnected && (
                  <span className="text-xs text-green-600">
                    Data synced from server ✅
                  </span>
                )}
              </div>
            </div>
<button
  onClick={handleDiagnose}
  className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-md transition-colors ml-2"
>
  🔬 Diagnose Connection
</button>

         
            <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
              <h4 className="font-medium mb-2">🐛 Debug Info:</h4>
              <div className="space-y-1">
                <p>Current Streak: {streakData?.currentStreak}</p>
                <p>Longest Streak: {streakData?.longestStreak}</p>
                <p>Coin Balance: {coinData?.balance}</p>
                <p>Completed Days: {streakData?.completedDays?.length || 0}</p>
                <p>Last Activity: {streakData?.lastActivityDate || 'Never'}</p>
              </div>
            </div> */}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StreakTracker 
                onStreakUpdate={handleStreakUpdate}
                initialData={streakData}
                backendConnected={backendConnected}
              />
              <CoinWallet 
                refreshTrigger={refreshTrigger}
                initialData={coinData}
                backendConnected={backendConnected}
              />
            </div>
            <Calendar 
              completedDays={streakData?.completedDays || []} 
            />
          </div>
        );
      case 'calendar':
        return (
          <div className="max-w-2xl mx-auto">
            <Calendar completedDays={streakData?.completedDays || []} />
          </div>
        );
      case 'store':
        return (
          <Store 
            onPurchase={handlePurchase}
            backendConnected={backendConnected}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
    
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                💻 Coding Consistency Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Keep coding, keep growing! 🚀
              </span>
           
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className="text-xs text-gray-500">
                  {backendConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

    
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'store'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🛒 Store
            </button>
          </div>
        </div>
      </nav>

    
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderContent()}
        </div>
      </main>

   
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              🎯 Stay consistent, code daily, and build great habits! 
            </p>
            <p className="text-xs mt-2">
              Track your progress • Earn rewards • Level up your skills
            </p>
            <p>
              Made in Love with Abhishek
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;