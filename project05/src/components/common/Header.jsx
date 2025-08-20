import React from 'react';
import { Moon, Sun } from 'lucide-react';

const Header = ({ title, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-orange-200'} p-4 flex justify-between items-center`}>
      <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h1>
      <button
        onClick={onToggleDarkMode}
        className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-orange-300 text-gray-700'} hover:opacity-80`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default Header;