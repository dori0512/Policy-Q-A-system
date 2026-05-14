// AuthContext.tsx
import React from 'react';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { apiService } from 'services/api';

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const verifyAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!token || !savedUser) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await apiService.validateToken(token);
      const email = response.email;
      if (email.toLowerCase() === savedUser?.toLowerCase())  {
        setUser(savedUser);
      } else {
        console.log('邮箱不匹配，登出');
        logout();
      }
    } catch (error) {
      console.error('验证失败:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);


  const login = async (email: string, password: string) => {
    const { token } = await authService.login(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', email);
    console.log('开始验证...');
    await verifyAuth(); // ✅ 确保等待验证完成
    console.log('验证完成，当前用户:', user);
  };
  
  const register = async (email: string, password: string) => {
    const { token } = await authService.register(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', email);
    console.log('开始验证...');
    await verifyAuth(); // ✅ 确保等待验证完成
    console.log('验证完成，当前用户:', user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};