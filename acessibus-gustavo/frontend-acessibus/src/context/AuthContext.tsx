import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/Api';

interface User {
  id?: string;
  nome?: string;
  email?: string;
  foto?: string;
  [key: string]: any;
}

interface AuthContextType {
  signed: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  signed: false,
  user: null,
  setUser: () => {},
  loading: false,
  signIn: async () => {},
  signOut: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storagedUser = await AsyncStorage.getItem('@RNAuth:user');
        const storagedToken = await AsyncStorage.getItem('@RNAuth:token');

        if (storagedUser && storagedToken) {
          console.log("[AUTH] Recuperando sessão salva...");
          api.defaults.headers.common.Authorization = `Bearer ${storagedToken}`;
          setUser(JSON.parse(storagedUser));
        }
      } catch (error) {
        console.log("[AUTH] Erro de storage", error);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const signIn = async (email: string, senha: string): Promise<void> => {
    console.log(`[AUTH] Iniciando login para: ${email}`);

    try {
      const response = await api.post('/auth/login', { email, senha });

      console.log("[AUTH] Login OK! Salvando token...");

      const { token, ...userData } = response.data;

      setUser(userData);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@RNAuth:token', token);
    } catch (error) {
      console.error("[AUTH] Erro no login:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    console.log("[AUTH] Fazendo logout...");
    try {
      await AsyncStorage.clear();
      setUser(null);
      delete api.defaults.headers.common.Authorization;
    } catch (error) {
      console.error("[AUTH] Erro ao fazer logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, setUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
