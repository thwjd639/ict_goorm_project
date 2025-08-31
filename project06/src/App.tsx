import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { useAuth } from './hooks/useAuth';
import { fetchProducts } from './services/api';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';

export default function ShoppingMallApp() {
  const [state, dispatch] = useAppStore();
  const { login, logout } = useAuth({ dispatch });

  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: 'PRODUCTS_SET_LOADING', payload: true });
      try {
        const products = await fetchProducts();
        dispatch({ type: 'PRODUCTS_SET_ITEMS', payload: products });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '상품을 불러오는데 실패했습니다.';
        dispatch({ type: 'PRODUCTS_SET_ERROR', payload: errorMessage });
      }
    };

    loadProducts();
  }, [dispatch]);

  const handleLogout = async () => {
    await logout();
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'products':
        return <HomePage state={state} dispatch={dispatch} />;
      case 'cart':
        return <CartPage state={state} dispatch={dispatch} />;
      case 'login':
        return <LoginPage state={state} onLogin={login} />;
      default:
        return <HomePage state={state} dispatch={dispatch} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state.currentView !== 'login' && (
        <Header 
          state={state} 
          dispatch={dispatch} 
          onLogout={handleLogout}
        />
      )}
      {renderCurrentView()}
    </div>
  );
}