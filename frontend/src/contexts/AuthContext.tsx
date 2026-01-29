import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para validar token e recuperar dados do usuário
  const validateToken = async (storedToken: string) => {
    try {
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      return { valid: true, user: response.data.user };
    } catch (error: any) {
      // Se o token for inválido ou expirado, limpar localStorage
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { valid: false, user: null };
      }
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        // Validar token com o backend
        try {
          const validation = await validateToken(storedToken);
          if (validation.valid && validation.user) {
            setToken(storedToken);
            setUser(validation.user);
            // Atualizar dados do usuário no localStorage caso tenha mudado
            localStorage.setItem('user', JSON.stringify(validation.user));
          } else {
            // Token inválido, limpar estado
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          // Em caso de erro de rede, usar dados do localStorage como fallback
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              setToken(storedToken);
            } catch (e) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          }
        }
      } else if (storedUser) {
        // Se não há token mas há usuário, limpar (sessão inválida)
        localStorage.removeItem('user');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    const { token: newToken, user: newUser } = response.data;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token && !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

