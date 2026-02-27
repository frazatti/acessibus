import React, { createContext, useState, useEffect, Children } from 'react';
import asyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/Api';

export const AuthContext = createContext({
    signed: false,
    user: null,
    loading: false,
    signIn: async () => { },
    signOut: async () => { }
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            try {
                const storagedUser = await asyncStorage.getItem('@RNAuth:user');
                const storagedToken = await asyncStorage.getItem('@RNAuth:token');

                if (storagedUser && storagedToken) {
                    console.log("[AUTH] Recuperando sessão salva...");
                    api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
                    setUser(JSON.parse(storagedUser));
                }
            } catch (error) {
                console.log("[AUTH] Erro de storage", error);
            } finally {
                setLoading(false);
            }
        }
        loadStorageData();
    }, []);

    async function signIn(email, senha) {
        console.log(`[AUTH] Iniciando login para: ${email}`);

        const response = await api.post('/auth/login', { email, senha });

        console.log("[AUTH] Login OK! Salvando token...");

        const { token, ...userData } = response.data;

        setUser(userData);
        api.defaults.headers.Authorization = `Bearer ${token}`;

        await asyncStorage.setItem('@RNAuth:user', JSON.stringify(userData));
        await asyncStorage.setItem('@RNAuth:token', token);
    }

    async function signOut() {
        console.log("[AUTH] Fazendo logout...");
        await asyncStorage.clear();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, setUser, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}