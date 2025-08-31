// Types
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  favorites: number[];
  user: User | null;
  loading: boolean;
  currentView: 'products' | 'cart' | 'login';
  selectedCategory: string;
  searchQuery: string;
}

export type ViewType = 'products' | 'cart' | 'login';

export type CategoryType = '모든' | '전자기기' | '주얼리' | '남성의류' | '여성의류';