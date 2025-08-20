import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

const ExpenseForm = ({ onAddExpense, editingItem, onUpdateExpense, onCancelEdit, categories, isDarkMode }) => {
  const [category, setCategory] = useState(editingItem?.category || '');
  const [description, setDescription] = useState(editingItem?.description || '');
  const [amount, setAmount] = useState(editingItem?.amount || '');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setCategory(editingItem.category);
      setDescription(editingItem.description || '');
      setAmount(editingItem.amount);
      setIsCustomCategory(!categories.includes(editingItem.category));
    } else {
      setCategory('');
      setDescription('');
      setAmount('');
      setIsCustomCategory(false);
    }
  }, [editingItem, categories]);

  const handleSubmit = () => {
    if (!category.trim() || !amount) return;

    const expenseData = {
      category: category.trim(),
      description: description.trim(),
      amount: parseInt(amount),
      date: new Date().toISOString()
    };

    if (editingItem) {
      onUpdateExpense(editingItem.id, expenseData);
    } else {
      onAddExpense(expenseData);
    }

    setCategory('');
    setDescription('');
    setAmount('');
    setIsCustomCategory(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleCategoryChange = (value) => {
    if (value === 'custom') {
      setIsCustomCategory(true);
      setCategory('');
    } else {
      setIsCustomCategory(false);
      setCategory(value);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 space-y-4`}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            지출 항목
          </label>
          {!isCustomCategory ? (
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">+ 새 카테고리 입력</option>
            </select>
          ) : (
            <div className="flex space-x-1">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="새 카테고리 입력"
                autoFocus
              />
              <button
                onClick={() => setIsCustomCategory(false)}
                className={`px-2 py-1 text-xs rounded ${
                  isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                선택
              </button>
            </div>
          )}
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            내용
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
            placeholder="지출 내용 입력"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
            비용
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>{editingItem ? '수정' : '제출'}</span>
        </button>
        {editingItem && (
          <button
            onClick={() => {
              onCancelEdit();
              setIsCustomCategory(false);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpenseForm;