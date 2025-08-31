import { useReducer, type Dispatch } from 'react';
import { authReducer, initialAuthState, type AuthAction, type AuthState } from './authSlice';
import { cartReducer, initialCartState, type CartAction, type CartState } from './cartSlice';
import { productsReducer, initialProductsState, type ProductsAction, type ProductsState } from './productsSlice';

// Combined App State
export interface AppState {
  auth: AuthState;
  cart: CartState;
  products: ProductsState;
  currentView: 'products' | 'cart' | 'login';
}

// Combined Actions
export type AppAction = 
  | AuthAction
  | CartAction
  | ProductsAction
  | { type: 'APP_SET_VIEW'; payload: 'products' | 'cart' | 'login' };

// Combined Initial State
export const initialAppState: AppState = {
  auth: initialAuthState,
  cart: initialCartState,
  products: initialProductsState,
  currentView: 'products',
};

// Root Reducer - combines all slice reducers
export const rootReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'APP_SET_VIEW':
      return { ...state, currentView: action.payload };
    
    // Auth actions
    case 'AUTH_SET_USER':
    case 'AUTH_SET_LOADING':
    case 'AUTH_SET_ERROR':
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        auth: authReducer(state.auth, action as AuthAction)
      };

    // Cart actions
    case 'CART_ADD_ITEM':
    case 'CART_REMOVE_ITEM':
    case 'CART_UPDATE_QUANTITY':
    case 'CART_CLEAR':
    case 'CART_TOGGLE_FAVORITE':
      return {
        ...state,
        cart: cartReducer(state.cart, action as CartAction)
      };

    // Products actions
    case 'PRODUCTS_SET_ITEMS':
    case 'PRODUCTS_SET_LOADING':
    case 'PRODUCTS_SET_ERROR':
    case 'PRODUCTS_SET_CATEGORY':
    case 'PRODUCTS_SET_SEARCH':
    case 'PRODUCTS_CLEAR_ERROR':
      return {
        ...state,
        products: productsReducer(state.products, action as ProductsAction)
      };

    default:
      return state;
  }
};

// Hook for using the combined store
export function useAppStore(): [AppState, Dispatch<AppAction>] {
  return useReducer(rootReducer, initialAppState);
}

// Export action types and state types
export type { AuthAction, CartAction, ProductsAction };
export type { AuthState, CartState, ProductsState };