import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onEdit, onDelete, isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      {expenses.length === 0 ? (
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>지출 항목이 없습니다.</p>
      ) : (
        <div>
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;