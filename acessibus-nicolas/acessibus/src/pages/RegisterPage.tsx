// src/components/RegisterPage.tsx

import React, { useState } from 'react';
import { UserIcon } from '../components/Icons';
import { registrarUsuario } from './Auth';

interface RegisterPageProps {
  onRegisterSuccess: (name: string, email: string) => void;
  onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      console.log("[REGISTER PAGE] Enviando dados para registrarUsuario...");

      // 🔥 Registrar — Firebase já faz LOGIN automático após criar a conta!
      const user = await registrarUsuario(email, password, name);

      console.log("[REGISTER PAGE] Usuário autenticado após cadastro:", user);

      // 🔥 Dispara callback para navegação principal
      onRegisterSuccess(name, email);

    } catch (error: any) {
      console.error("Erro no registro:", error.message);
      setError(error.message || "Erro inesperado ao registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen-minus-header-footer bg-gray-50 p-4 pt-16 pb-20 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <UserIcon size={96} className="text-gray-700 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Cadastre-se</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nome */}
          <div>
            <label className="block text-xl font-medium text-gray-700 text-left mb-2">Nome Completo</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xl font-medium text-gray-700 text-left mb-2">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-xl font-medium text-gray-700 text-left mb-2">Senha</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm font-semibold mt-3 text-left">{error}</p>}
          </div>

          {/* Botão */}
          <button
            type="submit"
            className={`w-full font-bold py-3 px-6 rounded-full text-xl shadow-md transition duration-300 mt-8 
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-8 text-md text-gray-700">
          Já tem uma conta?{' '}
          <button
            onClick={onNavigateToLogin}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
