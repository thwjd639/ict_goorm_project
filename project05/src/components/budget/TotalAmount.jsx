import React from 'react';

const TotalAmount = ({ total, budget, isDarkMode }) => {
  const remaining = budget ? budget - total : null;
  const isOverBudget = remaining !== null && remaining < 0;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-orange-200'} p-4 space-y-2`}>
      {budget && (
        <div className="text-right">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            예산: {budget.toLocaleString()}원
          </span>
        </div>
      )}
      <div className="text-right">
        <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          총지출: {total.toLocaleString()}원
        </span>
      </div>
      {remaining !== null && (
        <div className="text-right">
          <span className={`text-lg font-bold ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
            잔액: {remaining.toLocaleString()}원
            {isOverBudget && ' (예산 초과)'}
          </span>
        </div>
      )}
    </div>
  );
};

export default TotalAmount;