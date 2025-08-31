import React, { useState } from 'react';
import { ShoppingCart, LogIn, LogOut, Search, Menu, X } from 'lucide-react';
import type { AppState, AppAction } from '../store';
import { calculateCartItemsCount } from '../utils/helpers';

interface HeaderProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, dispatch, onLogout }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const cartItemsCount = calculateCartItemsCount(state.cart.items);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold text-purple-600 ml-2">Shop</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="상품 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={state.products.searchQuery}
                onChange={(e) => dispatch({ type: 'PRODUCTS_SET_SEARCH', payload: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => dispatch({ type: 'APP_SET_VIEW', payload: 'cart' })}
            >
              <ShoppingCart size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {state.auth.user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline text-sm text-gray-700">
                  {state.auth.user.displayName}
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  disabled={state.auth.loading}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => dispatch({ type: 'APP_SET_VIEW', payload: 'login' })}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LogIn size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="상품 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={state.products.searchQuery}
              onChange={(e) => dispatch({ type: 'PRODUCTS_SET_SEARCH', payload: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => {
                dispatch({ type: 'APP_SET_VIEW', payload: 'products' });
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              상품
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'APP_SET_VIEW', payload: 'cart' });
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              장바구니 ({cartItemsCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};