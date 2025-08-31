import React, { useState } from 'react';
import type { AppState } from '../types';

interface LoginPageProps {
  state: AppState;
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ state, onLogin }) => {
  const [email, setEmail] = useState('test10@example.com');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await onLogin(email, password);
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? '회원가입' : '로그인'}
            </h2>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {state.loading ? 
                (isSignUp ? '회원가입 중...' : '로그인 중...') : 
                (isSignUp ? '회원가입' : '로그인')
              }
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {isSignUp ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}{' '}
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-purple-600 hover:text-purple-700"
            >
              {isSignUp ? '로그인' : '회원가입'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};