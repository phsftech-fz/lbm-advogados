import { useState } from 'react';
import api from '../config/api';

export default function ProcessMonitoring() {
  const [cnpj, setCnpj] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/monitoring/search', { cnpj });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <header className="h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="material-icons-outlined text-primary">radar</span>
          Monitoramento de Processos
        </h1>
      </header>

      <section className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">Consultar Novos Processos</h2>
          <p className="text-gray-500 dark:text-gray-400">Insira o CNPJ da empresa para rastrear novas distribuições.</p>
          <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-lg mx-auto">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <span className="material-icons-outlined">business</span>
            </span>
            <input
              type="text"
              placeholder="00.000.000/0000-00"
              className="w-full pl-10 pr-32 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-lg rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-red-700 text-white font-medium rounded-md shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-icons-outlined text-sm">search</span>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>
      </section>

      {results.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resultados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-l-4 border-l-primary hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 dark:bg-red-900/20 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
                      {result.area}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{result.processNumber}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{result.court}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Autor:</span>
                      <span className="font-medium">{result.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Réu:</span>
                      <span className="font-medium">{result.defendant}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valor:</span>
                      <span className="font-medium">R$ {result.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

