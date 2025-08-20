import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpensePieChart = ({ expenses, isDarkMode }) => {
  const data = expenses.reduce((acc, cur) => {
    const existing = acc.find((item) => item.name === cur.category);
    if (existing) {
      existing.value += cur.amount;
    } else {
      acc.push({ name: cur.category, value: cur.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const renderLabel = ({ name, percent }) => {
    return `${name} ${(percent * 100).toFixed(1)}%`;
  };
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        카테고리별 지출 비율
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label={renderLabel}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
