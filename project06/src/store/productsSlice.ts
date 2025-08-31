import type { Product } from '../types';

// Products State
export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
}

// Products Actions
export type ProductsAction =
  | { type: 'PRODUCTS_SET_ITEMS'; payload: Product[] }
  | { type: 'PRODUCTS_SET_LOADING'; payload: boolean }
  | { type: 'PRODUCTS_SET_ERROR'; payload: string | null }
  | { type: 'PRODUCTS_SET_CATEGORY'; payload: string }
  | { type: 'PRODUCTS_SET_SEARCH'; payload: string }
  | { type: 'PRODUCTS_CLEAR_ERROR' };

// Initial Products State
export const initialProductsState: ProductsState = {
  items: [],
  loading: true,
  error: null,
  selectedCategory: '모든',
  searchQuery: '',
};

// Products Reducer
export const productsReducer = (state: ProductsState, action: ProductsAction): ProductsState => {
  switch (action.type) {
    case 'PRODUCTS_SET_ITEMS':
      return { 
        ...state, 
        items: action.payload, 
        loading: false, 
        error: null 
      };

    case 'PRODUCTS_SET_LOADING':
      return { ...state, loading: action.payload };

    case 'PRODUCTS_SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };

    case 'PRODUCTS_SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    case 'PRODUCTS_SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'PRODUCTS_CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};