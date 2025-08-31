import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType, Action } from '../types';
import { getImageFallback } from '../utils/helpers';

interface CartItemProps {
  item: CartItemType;
  dispatch: React.Dispatch<Action>;
}

export const CartItem: React.FC<CartItemProps> = ({ item, dispatch }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = getImageFallback(64);
  };

  const updateQuantity = (newQuantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: item.id, quantity: newQuantity }
    });
  };

  const removeFromCart = () => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: item.id });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 object-cover rounded"
          onError={handleImageError}
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{item.title}</h3>
          <p className="text-gray-600">${item.price}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item.quantity - 1)}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="text-right">
          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          <button
            onClick={removeFromCart}
            className="text-red-500 hover:text-red-700 mt-1"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};