import React, { useRef } from 'react';
import { ArrowUpDown, Upload, Download } from 'lucide-react';

const ControlPanel = ({ onSort, currentSort, onExport, onImport, isDarkMode }) => {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onSort('date')}
            className={`px-3 py-1 text-sm rounded flex items-center space-x-1 ${
              currentSort === 'date' 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowUpDown size={14} />
            <span>날짜순</span>
          </button>
          <button
            onClick={() => onSort('amount')}
            className={`px-3 py-1 text-sm rounded flex items-center space-x-1 ${
              currentSort === 'amount' 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowUpDown size={14} />
            <span>금액순</span>
          </button>
          <button
            onClick={() => onSort('category')}
            className={`px-3 py-1 text-sm rounded flex items-center space-x-1 ${
              currentSort === 'category' 
                ? 'bg-blue-600 text-white' 
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowUpDown size={14} />
            <span>카테고리순</span>
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded flex items-center space-x-1"
          >
            <Download size={14} />
            <span>내보내기</span>
          </button>
          <button
            onClick={handleImportClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded flex items-center space-x-1"
          >
            <Upload size={14} />
            <span>가져오기</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;