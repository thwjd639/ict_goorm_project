import { useState } from 'react';

export const useBudgetData = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState(['식비', '교통비', '주거비', '의료비', '쇼핑', '오락', '기타']);
  const [editingItem, setEditingItem] = useState(null);
  const [currentSort, setCurrentSort] = useState('date');
  const [alertState, setAlertState] = useState({
    type: '',
    message: '',
    isVisible: false
  });

  const showAlert = (type, message) => {
    setAlertState({ type, message, isVisible: true });
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  return {
    expenses,
    setExpenses,
    budget,
    setBudget,
    categories,
    setCategories,
    editingItem,
    setEditingItem,
    currentSort,
    setCurrentSort,
    alertState,
    showAlert
  };
};