import React, { useState } from 'react';
import Header from './components/common/Header';
import AlertMessage from './components/common/AlertMessage';
import BudgetForm from './components/budget/BudgetForm';
import TotalAmount from './components/budget/TotalAmount';
import CategoryManager from './components/category/CategoryManager';
import ExpenseForm from './components/expense/ExpenseForm';
import ExpenseList from './components/expense/ExpenseList';
import DeleteAllButton from './components/expense/DeleteAllButton';
import ControlPanel from './components/controls/ControlPanel';
import ExpensePieChart from './components/charts/ExpensePieChart';
import { useBudgetData } from './hooks/useBudgetData';
import { sortExpenses } from './utils/sorting';
import { exportData, importData } from './utils/storage';

const BudgetCalculatorApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const {
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
  } = useBudgetData();

  // 비즈니스 로직 함수들...
  const handleSetBudget = (budgetAmount) => {
    setBudget(budgetAmount);
    showAlert('success', '예산이 설정되었습니다.');
  };

  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      showAlert('success', '새 카테고리가 추가되었습니다.');
    }
  };

  // 카테고리 삭제 함수
  const handleDeleteCategory = (categoryToDelete) => {
    // 해당 카테고리를 사용하는 지출이 있는지 확인
    const isUsed = expenses.some(expense => expense.category === categoryToDelete);
    if (isUsed) {
      showAlert('error', '사용 중인 카테고리는 삭제할 수 없습니다.');
      return;
    }
    
    setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
    showAlert('success', '카테고리가 삭제되었습니다.');
  };

  // 지출 추가 시 새 카테고리 자동 추가
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      id: Date.now(),
      ...expenseData
    };
    
    // 새 카테고리인 경우 카테고리 목록에 추가
    if (!categories.includes(expenseData.category)) {
      setCategories(prev => [...prev, expenseData.category]);
    }
    
    setExpenses(prev => [...prev, newExpense]);
    showAlert('success', '아이템이 생성되었습니다.');
  };

  // 지출 수정 함수
  const handleUpdateExpense = (id, updatedData) => {
    // 새 카테고리인 경우 카테고리 목록에 추가
    if (!categories.includes(updatedData.category)) {
      setCategories(prev => [...prev, updatedData.category]);
    }
    
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id ? { ...expense, ...updatedData } : expense
      )
    );
    setEditingItem(null);
    showAlert('success', '아이템이 수정되었습니다.');
  };

  // 지출 삭제 함수
  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    if (editingItem && editingItem.id === id) {
      setEditingItem(null);
    }
    showAlert('error', '아이템이 삭제되었습니다.');
  };

  // 전체 삭제 함수
  const handleDeleteAll = () => {
    setExpenses([]);
    setEditingItem(null);
    showAlert('error', '모든 아이템이 삭제되었습니다.');
  };

  // 수정 시작 함수
  const handleEditExpense = (expense) => {
    setEditingItem(expense);
  };

  // 수정 취소 함수
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // 다크모드 토글
  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // 정렬 함수
  const handleSort = (sortType) => {
    setCurrentSort(sortType);
  };

  // 데이터 내보내기
  const handleExport = () => {
    const data = {
      expenses,
      budget,
      categories,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showAlert('success', '데이터가 내보내기되었습니다.');
  };

  // 데이터 가져오기
  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.expenses && Array.isArray(importedData.expenses)) {
          setExpenses(importedData.expenses);
          if (importedData.budget) {
            setBudget(importedData.budget);
          }
          if (importedData.categories && Array.isArray(importedData.categories)) {
            setCategories(importedData.categories);
          }
          showAlert('success', '데이터가 성공적으로 가져와졌습니다.');
        } else {
          showAlert('error', '올바르지 않은 파일 형식입니다.');
        }
      } catch (error) {
        showAlert('error', '파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const sortedExpenses = sortExpenses(expenses, currentSort);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-orange-100'}`}>
      <div className="max-w-2xl mx-auto">
        <Header 
          title="예산 계산기" 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={handleToggleDarkMode}
        />
        
        <AlertMessage
          type={alertState.type}
          message={alertState.message}
          isVisible={alertState.isVisible}
          isDarkMode={isDarkMode}
        />

        <BudgetForm
          budget={budget}
          onSetBudget={handleSetBudget}
          isDarkMode={isDarkMode}
        />

        <CategoryManager
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          isDarkMode={isDarkMode}
        />

        <ExpenseForm
          onAddExpense={handleAddExpense}
          editingItem={editingItem}
          onUpdateExpense={handleUpdateExpense}
          onCancelEdit={handleCancelEdit}
          categories={categories}
          isDarkMode={isDarkMode}
        />

        <ControlPanel
          onSort={handleSort}
          currentSort={currentSort}
          onExport={handleExport}
          onImport={handleImport}
          isDarkMode={isDarkMode}
        />

        <ExpenseList
          expenses={sortedExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          isDarkMode={isDarkMode}
        />

        <DeleteAllButton
          onDeleteAll={handleDeleteAll}
          hasExpenses={expenses.length > 0}
          isDarkMode={isDarkMode}
        />

        <TotalAmount 
          total={totalAmount} 
          budget={budget}
          isDarkMode={isDarkMode}
        />

        <ExpensePieChart 
          expenses={expenses} 
          isDarkMode={isDarkMode} 
        />
      </div>
    </div>
  );
};

export default BudgetCalculatorApp;