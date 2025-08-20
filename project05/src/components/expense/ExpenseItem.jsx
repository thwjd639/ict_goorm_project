import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const ExpenseItem = ({ expense, onEdit, onDelete, isDarkMode }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className={`flex justify-between items-center py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center space-x-3">
        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(expense.date)}</span>
        <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>[{expense.category}]</span>
        <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{expense.description}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{expense.amount.toLocaleString()}원</span>
        <button
          onClick={() => onEdit(expense)}
          className="text-green-600 hover:text-green-800"
        >
          <Edit3 size={16} />
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;