
class MockDatabase {
  constructor() {
    this.userData = {
      id: 1,
      username: "coder123",
      currentStreak: 5,
      longestStreak: 12,
      totalCoins: 150,
      completedDays: [
        "2025-06-03",
        "2025-06-04", 
        "2025-06-05",
        "2025-06-06",
        "2025-06-07"
      ],
      lastActivityDate: "2025-06-07"
    };

    this.storeItems = [
      {
        id: 1,
        name: "Theme: Dark Mode Pro",
        description: "Unlock premium dark theme",
        price: 50,
        category: "themes",
        icon: "🌙"
      },
      {
        id: 2,
        name: "Badge: Streak Master",
        description: "Show off your consistency",
        price: 100,
        category: "badges",
        icon: "🏆"
      },
      {
        id: 3,
        name: "Hint Tokens (5x)",
        description: "Get hints for difficult problems",
        price: 75,
        category: "utilities",
        icon: "💡"
      },
      {
        id: 4,
        name: "Avatar Frame: Golden",
        description: "Premium golden avatar frame",
        price: 120,
        category: "avatars",
        icon: "⭐"
      }
    ];

    this.purchaseHistory = [];
  }

  getUserData() {
    return { ...this.userData };
  }

  updateUserData(updates) {
    this.userData = { ...this.userData, ...updates };
    return this.userData;
  }

  getStoreItems() {
    return [...this.storeItems];
  }

  purchaseItem(itemId) {
    const item = this.storeItems.find(i => i.id === itemId);
    if (!item || this.userData.totalCoins < item.price) {
      return null;
    }

    this.userData.totalCoins -= item.price;
    const purchase = {
      id: Date.now(),
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      purchaseDate: new Date().toISOString().split('T')[0]
    };
    this.purchaseHistory.push(purchase);
    
    return purchase;
  }

  getPurchaseHistory() {
    return [...this.purchaseHistory];
  }
}

module.exports = new MockDatabase();
