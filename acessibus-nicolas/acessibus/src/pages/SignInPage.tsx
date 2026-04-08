import React, { useState } from 'react';
import { UserIcon, FacebookIcon, GoogleIcon } from '../components/Icons'; // LoadingIcon removed — using local LoadingIcon component
import { loginUsuario } from './Auth'; // Importa a função de login real

interface SignInPageProps {
  onLoginSuccess: (email: string) => void;
  onNavigateToRegister: () => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Novo estado de carregamento

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
        setError('Por favor, preencha o e-mail e a senha.');
        return;
    }

    setIsLoading(true); // Inicia o carregamento

    try {
      // CHAMA A FUNÇÃO REAL DO FIREBASE
      const user = await loginUsuario(email, password);
      
      // Se o login for bem-sucedido (o erro é tratado no Auth.ts), chamamos o sucesso
      onLoginSuccess(user.email || email);

    } catch (firebaseError: any) {
      // Exibe a mensagem de erro formatada pelo Auth.ts
      console.error("Erro no Login:", firebaseError.message);
      setError(firebaseError.message);

    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen-minus-header-footer bg-gray-50 p-4 pt-16 pb-20 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <UserIcon size={96} className="text-gray-700 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Entrar</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xl font-medium text-gray-700 text-left mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!error}
              aria-describedby={error ? 'email-error' : undefined}
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xl font-medium text-gray-700 text-left mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={!!error}
              aria-describedby={error ? 'password-error' : undefined}
              disabled={isLoading}
            />
            {error && <p id="password-error" className="text-red-500 text-sm font-semibold mt-2 text-left">{error}</p>}
          </div>
          <button
            type="submit"
            className={`w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-full text-xl shadow-md transition duration-300 mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <LoadingIcon size={24} className="animate-spin mr-3" />
                    Entrando...
                </div>
            ) : (
                'Entrar'
            )}
          </button>
        </form>

        <div className="mt-8 flex justify-center space-x-6">
          {/* NOTE: Login com Facebook e Google requer configuração adicional do Firebase */}
          <button
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition duration-300"
            aria-label="Entrar com Facebook"
            disabled={isLoading}
          >
            <FacebookIcon size={32} color="white" />
          </button>
          <button
            className="p-3 rounded-full bg-white border border-gray-300 hover:bg-gray-100 shadow-md transition duration-300"
            aria-label="Entrar com Google"
            disabled={isLoading}
          >
            <GoogleIcon size={32} />
          </button>
        </div>
        <p className="mt-8 text-md text-gray-700">
          Não tem uma conta?{' '}
          <button
            onClick={onNavigateToRegister}
            className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

// Adiciona um ícone simples de carregamento para uso no botão
const LoadingIcon: React.FC<{ size: number, className?: string }> = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
    </svg>
);

export default SignInPage;