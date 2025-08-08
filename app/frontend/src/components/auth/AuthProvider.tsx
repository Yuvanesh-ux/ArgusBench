import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from '@/services/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  token: string | null;
  user: { id: string; email: string; firstName?: string; lastName?: string; role?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<AuthContextValue['user']>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
      getMe()
        .then((res) => setUser(res.user))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('accessToken');
        });
    } else {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setToken(res.accessToken);
    setUser(res.user);
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const res = await registerApi(data);
    setToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async () => {
    await logoutApi();
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(token),
    token,
    user,
    login,
    register,
    logout,
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


