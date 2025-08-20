import React, { useState } from 'react';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory, isDarkMode }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:underline mb-2`}
      >
        카테고리 관리 {isExpanded ? '▼' : '▶'}
      </button>
      
      {isExpanded && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="새 카테고리 입력"
              className={`flex-1 p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              }`}
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded"
            >
              추가
            </button>
          </div>
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={`flex items-center space-x-1 px-2 py-1 text-xs rounded ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => onDeleteCategory(cat)}
                    className="text-red-500 hover:text-red-700 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManager;