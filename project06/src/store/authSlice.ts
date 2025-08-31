import type { User } from '../types';

// Auth State
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Auth Actions
export type AuthAction =
  | { type: 'AUTH_SET_USER'; payload: User | null }
  | { type: 'AUTH_SET_LOADING'; payload: boolean }
  | { type: 'AUTH_SET_ERROR'; payload: string | null }
  | { type: 'AUTH_CLEAR_ERROR' };

// Initial Auth State
export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Auth Reducer
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    case 'AUTH_SET_LOADING':
      return { ...state, loading: action.payload };
    case 'AUTH_SET_ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    case 'AUTH_CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};