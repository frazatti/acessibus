// src/components/Auth.ts

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase.js';


export const registrarUsuario = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
        throw new Error("Por favor, preencha todos os campos.");
    }

    if (password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            createdAt: new Date(),
        });

        return user;
    } catch (error: any) {
        switch (error.code) {
            case 'auth/email-already-in-use':
                throw new Error('Este e-mail já está em uso.');
            case 'auth/invalid-email':
                throw new Error('O formato do e-mail é inválido.');
            case 'auth/weak-password':
                throw new Error('A senha é muito fraca (mínimo 6 caracteres).');
            case 'auth/network-request-failed':
                throw new Error('Falha na conexão de rede.');
            default:
                throw new Error("Erro inesperado ao registrar.");
        }
    }
};

// ===============================
// LOGIN
// ===============================
export const loginUsuario = async (email: string, password: string) => {
    if (!email || !password) {
        throw new Error("Preencha e-mail e senha.");
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;

    } catch (error: any) {
        switch (error.code) {
            case 'auth/user-not-found':
                throw new Error('Usuário não encontrado.');
            case 'auth/wrong-password':
                throw new Error('Senha incorreta.');
            case 'auth/invalid-email':
                throw new Error("E-mail inválido.");
            case 'auth/network-request-failed':
                throw new Error("Erro de conexão.");
            default:
                console.log("Erro login:", error.code, error.message);
                throw new Error("Erro ao fazer login.");
        }
    }
};
