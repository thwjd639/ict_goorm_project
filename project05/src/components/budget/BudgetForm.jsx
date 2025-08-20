import React, { useState } from 'react';

const BudgetForm = ({ budget, onSetBudget, isDarkMode }) => {
  const [budgetInput, setBudgetInput] = useState(budget || '');

  const handleSetBudget = () => {
    if (budgetInput && parseInt(budgetInput) > 0) {
      onSetBudget(parseInt(budgetInput));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSetBudget();
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <div className="flex space-x-4 items-end">
        <div className="flex-1">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            예산 설정
          </label>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
            placeholder="예산 금액을 입력하세요"
          />
        </div>
        <button
          onClick={handleSetBudget}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          설정
        </button>
      </div>
    </div>
  );
};

export default BudgetForm;