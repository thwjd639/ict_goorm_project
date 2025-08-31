import React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { AppState, Action } from '../types';
import { CartItem } from '../components/CartItem';
import { calculateCartTotal } from '../utils/helpers';

interface CartPageProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const CartPage: React.FC<CartPageProps> = ({ state, dispatch }) => {
  const cartTotal = calculateCartTotal(state.cart);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">장바구니</h2>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'products' })}
          className="text-purple-600 hover:text-purple-700"
        >
          계속 쇼핑하기
        </button>
      </div>

      {state.cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingCart size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Cart가 비어있습니다.</h3>
          <p className="text-gray-600 mb-4">Cart에 상품을 넣어주세요.</p>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'products' })}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            계속 쇼핑하기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {state.cart.map((item) => (
            <CartItem key={item.id} item={item} dispatch={dispatch} />
          ))}

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>합계: ${cartTotal.toFixed(2)}</span>
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};