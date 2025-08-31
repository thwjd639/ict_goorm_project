import type { User } from '../types';

// Mock Firebase Auth
export const mockAuth = {
  signIn: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }
    return {
      id: '1',
      email,
      displayName: email.split('@')[0]
    };
  },
  
  signOut: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  signUp: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!email || !password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }
    return {
      id: Date.now().toString(),
      email,
      displayName: email.split('@')[0]
    };
  }
};