import React from 'react';
import { ShoppingCart } from 'lucide-react';
import type { AppState, Action } from '../types';
import { ProductCard } from '../components/ProductCard';
import { filterProducts, CATEGORIES } from '../utils/helpers';

interface HomePageProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export const HomePage: React.FC<HomePageProps> = ({ state, dispatch }) => {
  const filteredProducts = filterProducts(
    state.products, 
    state.selectedCategory, 
    state.searchQuery
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Products</h2>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                state.selectedCategory === category
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {state.loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing: {filteredProducts.length} items
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                dispatch={dispatch}
                isFavorite={state.favorites.includes(product.id)}
              />
            ))}
          </div>
        </>
      )}

      {!state.loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingCart size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};