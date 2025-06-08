import React, { useState, useEffect } from 'react';
import { getDaysInMonth, getMonthName, formatDate } from '../utils/dateUtils';

const Calendar = ({ completedDays = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, completedDays]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(new Date(year, month, day));
      const isCompleted = completedDays.includes(dateString);
      const isToday = dateString === formatDate(new Date());
      
      days.push({
        day,
        dateString,
        isCompleted,
        isToday
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayData, index) => (
          <div
            key={index}
            className={`
              h-10 flex items-center justify-center text-sm rounded-lg transition-colors
              ${!dayData ? '' : 
                dayData.isToday ? 'bg-blue-100 border-2 border-blue-500 font-bold' :
                dayData.isCompleted ? 'bg-green-500 text-white' : 
                'hover:bg-gray-100'
              }
            `}
          >
            {dayData && (
              <div className="relative">
                {dayData.day}
                {dayData.isCompleted && (
                  <div className="absolute -top-1 -right-1 text-xs">
                    ✅
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          Completed
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-blue-500 rounded mr-2"></div>
          Today
        </div>
      </div>
    </div>
  );
};

export default Calendar;
