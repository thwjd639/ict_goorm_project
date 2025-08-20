import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteAllButton = ({ onDeleteAll, hasExpenses, isDarkMode }) => {
  if (!hasExpenses) return null;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <button
        onClick={onDeleteAll}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center space-x-1"
      >
        <Trash2 size={16} />
        <span>목록 지우기</span>
      </button>
    </div>
  );
};

export default DeleteAllButton;