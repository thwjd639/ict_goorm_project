import React from 'react';

const AlertMessage = ({ type, message, isVisible, isDarkMode }) => {
  if (!isVisible) return null;
  
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`${bgColor} text-white p-3 text-center`}>
      {message}
    </div>
  );
};

export default AlertMessage;