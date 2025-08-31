import type { Product, CartItem } from '../types';

// Filter products based on category and search query
export const filterProducts = (
  products: Product[],
  selectedCategory: string,
  searchQuery: string
): Product[] => {
  return products.filter(product => {
    const matchesCategory = selectedCategory === '모든' || 
      (selectedCategory === '남성의류' && product.category === "men's clothing") ||
      (selectedCategory === '여성의류' && product.category === "women's clothing") ||
      (selectedCategory === '주얼리' && product.category === 'jewelery') ||
      (selectedCategory === '전자기기' && product.category === 'electronics');
    
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
};

// Calculate cart total
export const calculateCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calculate total items in cart
export const calculateCartItemsCount = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Format price
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Handle image error fallback
export const getImageFallback = (size: number = 300): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#F3F4F6"/>
      <path d="M${size/2} ${size/3}C${size/2 - size/10} ${size/3} ${size/2 - size/5} ${size/2 - size/10} ${size/2 - size/5} ${size/2}C${size/2 - size/5} ${size/2 + size/10} ${size/2 - size/10} ${size/2 + size/3} ${size/2} ${size/2 + size/3}C${size/2 + size/10} ${size/2 + size/3} ${size/2 + size/5} ${size/2 + size/10} ${size/2 + size/5} ${size/2}C${size/2 + size/5} ${size/2 - size/10} ${size/2 + size/10} ${size/3} ${size/2} ${size/3}Z" fill="#E5E7EB"/>
    </svg>
  `)}`;
};

// Categories list
export const CATEGORIES = ['모든', '전자기기', '주얼리', '남성의류', '여성의류'] as const;