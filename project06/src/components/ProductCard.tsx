import React from 'react';
import { Heart } from 'lucide-react';
import type { Product, Action } from '../types';
import { getImageFallback } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  dispatch: React.Dispatch<Action>;
  isFavorite: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  dispatch, 
  isFavorite 
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = getImageFallback(300);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={handleImageError}
        />
        <button
          onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: product.id })}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50"
        >
          <Heart
            size={16}
            className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.title}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          <div className="flex items-center text-sm text-gray-500">
            <span className="text-yellow-400">★</span>
            <span className="ml-1">{product.rating.rate} ({product.rating.count})</span>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
        >
          장바구니에 담기
        </button>
      </div>
    </div>
  );
};