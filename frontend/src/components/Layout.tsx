import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <aside className="hidden md:flex flex-col w-64 bg-secondary dark:bg-surface-dark border-r border-gray-800 dark:border-border-dark">
        <div className="h-20 flex items-center justify-center border-b border-gray-800 dark:border-border-dark px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10">
              <div className="w-3 bg-black dark:bg-white h-full"></div>
              <div className="w-4 bg-primary h-12 -mt-1 shadow-md z-10 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">B</span>
              </div>
              <div className="w-3 bg-black dark:bg-white h-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none tracking-widest text-white">LBM</span>
              <span className="text-[0.6rem] uppercase tracking-wider text-gray-400">Advogados</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive('/dashboard') && !location.pathname.includes('/dashboard/client')
                ? 'bg-red-50 dark:bg-red-900/20 text-primary border-l-4 border-primary'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-icons-outlined text-xl">dashboard</span>
            Visão Geral
          </Link>
          <Link
            to="/processes"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive('/processes')
                ? 'bg-red-50 dark:bg-red-900/20 text-primary border-l-4 border-primary'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-icons-outlined text-xl">gavel</span>
            Processos
          </Link>
          <Link
            to="/clients/new"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive('/clients/new')
                ? 'bg-red-50 dark:bg-red-900/20 text-primary border-l-4 border-primary'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-icons-outlined text-xl">person_add</span>
            Cadastro de Clientes
          </Link>
          <Link
            to="/monitoring"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive('/monitoring')
                ? 'bg-red-50 dark:bg-red-900/20 text-primary border-l-4 border-primary'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-icons-outlined text-xl">search</span>
            Monitoramento CNPJ
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
              <span className="material-icons-outlined text-sm">person</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-white">{user?.name}</span>
              <span className="text-xs text-gray-400">{user?.role}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Sair"
            >
              <span className="material-icons-outlined text-sm">logout</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

