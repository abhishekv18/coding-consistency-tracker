// const API_BASE_URL = 'http://localhost:5001/api';

// class ApiService {
//   async fetchData(endpoint) {
//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('API fetch error:', error);
//       throw error;
//     }
//   }

//   async postData(endpoint, data = {}) {
//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('API post error:', error);
//       throw error;
//     }
//   }

//   // Streak API calls
//   async getStreakData() {
//     return this.fetchData('/streak');
//   }

//   async markDayComplete() {
//     return this.postData('/streak/complete');
//   }

//   async resetStreak() {
//     return this.postData('/streak/reset');
//   }

//   // Coin API calls
//   async getCoinData() {
//     return this.fetchData('/coins');
//   }

//   async addCoins(amount) {
//     return this.postData('/coins/add', { amount });
//   }

//   // Store API calls
//   async getStoreItems() {
//     return this.fetchData('/store');
//   }

//   async purchaseItem(itemId) {
//     return this.postData('/store/purchase', { itemId });
//   }

//   async getPurchaseHistory() {
//     return this.fetchData('/store/history');
//   }
// }

// export default new ApiService();

// frontend/src/services/api.js (Debug Version)
// const API_BASE_URL = 'http://localhost:5000/api';

// class ApiService {
//   async fetchData(endpoint) {
//     console.log(`📡 Fetching: ${API_BASE_URL}${endpoint}`);
//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`,{
//         method:'GET',
        
//       }
//       );
//       console.log(`📊 Response status: ${response.status}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log(`✅ Data received:`, data);
//       return data;
//     } catch (error) {
//       console.error('❌ API fetch error:', error);
//       console.error('🔗 Failed URL:', `${API_BASE_URL}${endpoint}`);
//       throw error;
//     }
//   }

//   async postData(endpoint, data = {}) {
//     console.log(`📤 Posting to: ${API_BASE_URL}${endpoint}`, data);
//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
//       console.log(`📊 Response status: ${response.status}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const responseData = await response.json();
//       console.log(`✅ Data received:`, responseData);
//       return responseData;
//     } catch (error) {
//       console.error('❌ API post error:', error);
//       console.error('🔗 Failed URL:', `${API_BASE_URL}${endpoint}`);
//       throw error;
//     }
//   }

//   // Test connection method
//   async testConnection() {
//     try {
//       const response = await this.fetchData('/health');
//       console.log('🟢 Backend connection successful!', response);
//       return true;
//     } catch (error) {
//       console.error('🔴 Backend connection failed!', error);
//       return false;
//     }
//   }

//   // Streak API calls
//   async getStreakData() {
//     return this.fetchData('/streak');
//   }

//   async markDayComplete() {
//     return this.postData('/streak/complete');
//   }

//   async resetStreak() {
//     return this.postData('/streak/reset');
//   }

//   // Coin API calls
//   async getCoinData() {
//     return this.fetchData('/coins');
//   }

//   async addCoins(amount) {
//     return this.postData('/coins/add', { amount });
//   }

//   // Store API calls
//   async getStoreItems() {
//     return this.fetchData('/store');
//   }

//   async purchaseItem(itemId) {
//     return this.postData('/store/purchase', { itemId });
//   }

//   async getPurchaseHistory() {
//     return this.fetchData('/store/history');
//   }
// }

// export default new ApiService();

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.isDebugging = true; // Set to false in production
  }

  log(message, data = null) {
    if (this.isDebugging) {
      console.log(`🔍 [ApiService] ${message}`, data || '');
    }
  }

  logError(message, error) {
    console.error(`❌ [ApiService] ${message}`, error);
  }

  async fetchData(endpoint) {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    this.log(`Fetching: ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      this.log(`Response status: ${response.status}`);
      this.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      this.log(`Data received:`, data);
      return data;
    } catch (error) {
      // Enhanced error logging
      if (error.name === 'AbortError') {
        this.logError('Request timeout', `URL: ${fullUrl}`);
        throw new Error('Request timeout - backend might be down');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        this.logError('Network error - backend not reachable', `URL: ${fullUrl}`);
        throw new Error('Cannot connect to backend - is it running on port 5000?');
      } else {
        this.logError('API fetch error', error);
        throw error;
      }
    }
  }

  async postData(endpoint, data = {}) {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    this.log(`Posting to: ${fullUrl}`, data);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      this.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const responseData = await response.json();
      this.log(`Data received:`, responseData);
      return responseData;
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logError('Request timeout', `URL: ${fullUrl}`);
        throw new Error('Request timeout - backend might be down');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        this.logError('Network error - backend not reachable', `URL: ${fullUrl}`);
        throw new Error('Cannot connect to backend - is it running on port 5000?');
      } else {
        this.logError('API post error', error);
        throw error;
      }
    }
  }

  // Enhanced test connection method
  async testConnection() {
    try {
      this.log('🧪 Testing backend connection...');
      
      // First, try a simple fetch to see if the server is reachable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        this.log('✅ Backend connection successful!', data);
        return { success: true, data };
      } else {
        this.logError('Backend responded with error', `Status: ${response.status}`);
        return { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        this.logError('Connection timeout', 'Backend did not respond within 5 seconds');
        return { success: false, error: 'Connection timeout' };
      } else if (error.message.includes('fetch')) {
        this.logError('Network error', 'Cannot reach backend server');
        return { success: false, error: 'Network error - backend not reachable' };
      } else {
        this.logError('Connection test failed', error);
        return { success: false, error: error.message };
      }
    }
  }

  // Diagnostic method to check what's wrong
  async diagnose() {
    console.log('🔬 Running connection diagnostics...');
    
    const results = {
      timestamp: new Date().toISOString(),
      baseUrl: API_BASE_URL,
      tests: {}
    };

    // Test 1: Basic fetch to base URL
    try {
      const response = await fetch('http://localhost:5000', { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      results.tests.baseUrlReachable = {
        success: true,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      results.tests.baseUrlReachable = {
        success: false,
        error: error.message
      };
    }

    // Test 2: Health endpoint
    try {
      const healthResult = await this.testConnection();
      results.tests.healthEndpoint = healthResult;
    } catch (error) {
      results.tests.healthEndpoint = {
        success: false,
        error: error.message
      };
    }

    // Test 3: CORS preflight simulation
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        signal: AbortSignal.timeout(3000)
      });
      results.tests.corsPreflightCheck = {
        success: response.ok,
        status: response.status,
        corsHeaders: {
          'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
          'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
          'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
      };
    } catch (error) {
      results.tests.corsPreflightCheck = {
        success: false,
        error: error.message
      };
    }

    console.table(results.tests);
    return results;
  }

  // Streak API calls
  async getStreakData() {
    return this.fetchData('/streak');
  }

  async markDayComplete() {
    return this.postData('/streak/complete');
  }

  async resetStreak() {
    return this.postData('/streak/reset');
  }

  // Coin API calls
  async getCoinData() {
    return this.fetchData('/coins');
  }

  async addCoins(amount) {
    return this.postData('/coins/add', { amount });
  }

  // Store API calls
  async getStoreItems() {
    return this.fetchData('/store');
  }

  async purchaseItem(itemId) {
    return this.postData('/store/purchase', { itemId });
  }

  async getPurchaseHistory() {
    return this.fetchData('/store/history');
  }
}

export default new ApiService();