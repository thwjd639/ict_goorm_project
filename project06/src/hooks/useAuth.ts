import { useCallback } from 'react';
import { mockAuth } from '../services/auth';
import { AppAction } from '../store';

interface UseAuthProps {
  dispatch: React.Dispatch<AppAction>;
}

export const useAuth = ({ dispatch }: UseAuthProps) => {
  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_SET_LOADING', payload: true });
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
    
    try {
      const user = await mockAuth.signIn(email, password);
      dispatch({ type: 'AUTH_SET_USER', payload: user });
      dispatch({ type: 'APP_SET_VIEW', payload: 'products' });
      return { success: true, user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그인에 실패했습니다.';
      dispatch({ type: 'AUTH_SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await mockAuth.signOut();
      dispatch({ type: 'AUTH_SET_USER', payload: null });
      dispatch({ type: 'APP_SET_VIEW', payload: 'products' });
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '로그아웃에 실패했습니다.';
      dispatch({ type: 'AUTH_SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const signup = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_SET_LOADING', payload: true });
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
    
    try {
      const user = await mockAuth.signUp(email, password);
      dispatch({ type: 'AUTH_SET_USER', payload: user });
      dispatch({ type: 'APP_SET_VIEW', payload: 'products' });
      return { success: true, user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      dispatch({ type: 'AUTH_SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  return { login, logout, signup };
};