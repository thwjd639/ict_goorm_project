import type { CartItem, Product } from '../types';

// Cart State
export interface CartState {
  items: CartItem[];
  favorites: number[];
}

// Cart Actions
export type CartAction =
  | { type: 'CART_ADD_ITEM'; payload: Product }
  | { type: 'CART_REMOVE_ITEM'; payload: number }
  | { type: 'CART_UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CART_CLEAR' }
  | { type: 'CART_TOGGLE_FAVORITE'; payload: number };

// Initial Cart State
export const initialCartState: CartState = {
  items: [],
  favorites: [],
};

// Cart Reducer
export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'CART_UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CART_CLEAR':
      return {
        ...state,
        items: []
      };

    case 'CART_TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };

    default:
      return state;
  }
};