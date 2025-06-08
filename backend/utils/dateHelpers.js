const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

const isToday = (dateString) => {
  const today = getTodayString();
  return dateString === today;
};

const isYesterday = (dateString) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
};

const calculateStreakFromDates = (completedDays) => {
  if (!completedDays.length) return 0;
  
  const sortedDates = completedDays.sort().reverse();
  const today = getTodayString();
  

  let streak = 0;
  let currentCheckDate = new Date();
  
  for (const completedDate of sortedDates) {
    const checkDateString = currentCheckDate.toISOString().split('T')[0];
    
    if (completedDate === checkDateString) {
      streak++;
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;


  
  // let streak = 0;
  // let currentCheckDate = new Date();
  
  // for (const completedDate of sortedDates) {
  //   const checkDateString = currentCheckDate.split('T')[0];
    
  //   if (completedDate === checkDateString) {
  //     streak++;
  //     currentCheckDate.setDate(currentCheckDate.getDate() - 1);
  //   } else {
  //     break;
  //   }
  // }
  
  // return streak;
};

module.exports = {
  isToday,
  isYesterday,
  getTodayString,
  calculateStreakFromDates
};
