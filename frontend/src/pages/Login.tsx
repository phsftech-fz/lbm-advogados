import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark transition-colors">
      <div className="w-full max-w-5xl bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="w-full md:w-1/2 p-12 bg-gray-50 dark:bg-black flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-8 p-6 bg-white dark:bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex h-40 md:h-56 items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 bg-black h-10"></div>
                  <div className="w-4 bg-primary h-12 -mt-1 shadow-lg z-10 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">B</span>
                  </div>
                  <div className="w-3 bg-black h-10"></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-wide uppercase border-b-2 border-primary pb-2 inline-block">
                LBM Advogados
              </h2>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-sans tracking-[0.2em] uppercase font-semibold">
                Associados
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">Acesso Restrito</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Entre com suas credenciais para acessar o painel administrativo.</p>
          </div>
          {import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide">🔧 Modo Desenvolvimento</p>
              <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <p><strong>Email:</strong> admin@lbm.com.br</p>
                <p><strong>Senha:</strong> admin123</p>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                Usuário ou E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-outlined text-gray-400 text-[20px] group-focus-within:text-primary transition-colors">person</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                  id="email"
                  type="email"
                  placeholder="seu.email@lbm.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-outlined text-gray-400 text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer dark:bg-gray-700 dark:border-gray-600" id="remember-me" type="checkbox" />
                <label className="ml-2 block text-gray-700 dark:text-gray-300 cursor-pointer select-none" htmlFor="remember-me">
                  Manter conectado
                </label>
              </div>
              <a className="font-medium text-primary hover:text-primary-dark transition-colors hover:underline" href="#">
                Recuperar senha?
              </a>
            </div>
            <div>
              <button
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                <span className="material-icons-outlined text-[20px] mr-2">login</span>
                {loading ? 'Entrando...' : 'Acessar Sistema'}
              </button>
            </div>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              © 2026 LBM Advogados Associados. <br />Uso exclusivo interno.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

