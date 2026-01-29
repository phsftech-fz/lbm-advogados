import { useEffect, useState } from 'react';
import api from '../config/api';

interface Process {
  id: string;
  processNumber: string;
  referenceNumber?: string;
  title: string;
  status: string;
  lawArea: string;
  subArea?: string;
  client: {
    id: string;
    name: string;
    type: string;
  };
  lastUpdate: string;
}

interface ProcessDetail {
  id: string;
  processNumber: string;
  referenceNumber?: string;
  title: string;
  description?: string;
  status: string;
  lawArea: string;
  subArea?: string;
  priority: string;
  value?: number;
  court?: string;
  comarca?: string;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    type: string;
    cpfCnpj: string;
    email?: string;
    phone?: string;
  };
  responsibleUser: {
    id: string;
    name: string;
    email: string;
  };
  events: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    type: string;
    user?: {
      id: string;
      name: string;
      email?: string;
    };
  }>;
  documents: Array<{
    id: string;
    fileName: string;
    description?: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
  }>;
}

export default function ProcessTracking() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState<ProcessDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    area: '',
  });

  useEffect(() => {
    fetchProcesses();
  }, [filters]);

  const fetchProcesses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.area) params.append('area', filters.area);

      const response = await api.get(`/processes?${params.toString()}`);
      setProcesses(response.data);
    } catch (error) {
      console.error('Error fetching processes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessClick = async (processId: string) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    setSelectedProcess(null);
    try {
      const response = await api.get(`/processes/${processId}`);
      // Garantir que eventos e documentos sejam arrays mesmo se não existirem
      const processData = {
        ...response.data,
        events: response.data.events || [],
        documents: response.data.documents || [],
      };
      setSelectedProcess(processData);
    } catch (error) {
      console.error('Error fetching process details:', error);
      setShowDetailModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      EM_ANDAMENTO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      AGUARDANDO_AUDIENCIA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      CONCLUSO_PARA_SENTENCA: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ARQUIVADO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      SUSPENSO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      RECURSO: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      FAVORAVEL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      PRAZO_EM_ABERTO: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      URGENTE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      NORMAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      BAIXA: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acompanhamento Processual</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie seus casos, prazos e audiências.</p>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-lg p-5 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
              <input
                type="text"
                placeholder="Buscar por cliente, nº do processo..."
                className="w-full pl-10 pr-3 py-2 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full py-2 px-3 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Todos os Status</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="AGUARDANDO_AUDIENCIA">Aguardando Audiência</option>
              <option value="CONCLUSO_PARA_SENTENCA">Concluso para Sentença</option>
              <option value="ARQUIVADO">Arquivado</option>
              <option value="SUSPENSO">Suspenso</option>
              <option value="RECURSO">Recurso</option>
              <option value="FAVORAVEL">Favorável</option>
              <option value="PRAZO_EM_ABERTO">Prazo em Aberto</option>
            </select>
          </div>
          <div>
            <select
              className="w-full py-2 px-3 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
            >
              <option value="">Todas as Áreas</option>
              <option value="CIVEL">Cível</option>
              <option value="TRABALHISTA">Trabalhista</option>
              <option value="TRIBUTARIO">Tributário</option>
              <option value="CRIMINAL">Criminal</option>
              <option value="FAMILIA">Família</option>
              <option value="EMPRESARIAL">Empresarial</option>
              <option value="ADMINISTRATIVO">Administrativo</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : (
        <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Processo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Última Atualização
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {processes.map((process) => (
                <tr
                  key={process.id}
                  onClick={() => handleProcessClick(process.id)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-primary">{process.processNumber}</div>
                    {process.referenceNumber && (
                      <div className="text-xs text-gray-500">Ref: {process.referenceNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{process.client.name}</div>
                    <div className="text-xs text-gray-500">{process.client.type === 'PESSOA_FISICA' ? 'PF' : 'PJ'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{process.lawArea}</div>
                    {process.subArea && <div className="text-xs text-gray-500">{process.subArea}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(process.status)}`}>
                      {process.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(process.lastUpdate).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalhes do Processo */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detalhes do Processo</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedProcess(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            {loadingDetail ? (
              <div className="p-12 text-center">Carregando detalhes...</div>
            ) : selectedProcess ? (
              <div className="p-6 space-y-6">
                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Número do Processo
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedProcess.processNumber}</p>
                    {selectedProcess.referenceNumber && (
                      <p className="text-xs text-gray-500 mt-1">Ref: {selectedProcess.referenceNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Título</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProcess.status)}`}>
                      {selectedProcess.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {selectedProcess.priority && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prioridade</label>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedProcess.priority)}`}>
                        {selectedProcess.priority}
                      </span>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Área Jurídica</label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedProcess.lawArea}
                      {selectedProcess.subArea && ` - ${selectedProcess.subArea}`}
                    </p>
                  </div>
                  {selectedProcess.value && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Valor</label>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        R$ {selectedProcess.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                  {selectedProcess.court && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vara</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.court}</p>
                    </div>
                  )}
                  {selectedProcess.comarca && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Comarca</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.comarca}</p>
                    </div>
                  )}
                </div>

                {selectedProcess.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descrição</label>
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selectedProcess.description}</p>
                  </div>
                )}

                {/* Informações do Cliente */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.client.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CPF/CNPJ</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.client.cpfCnpj}</p>
                    </div>
                    {selectedProcess.client.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.client.email}</p>
                      </div>
                    )}
                    {selectedProcess.client.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone</label>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.client.phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Responsável */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Responsável</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Advogado</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.responsibleUser.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedProcess.responsibleUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* Eventos */}
                {selectedProcess.events && selectedProcess.events.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Eventos ({selectedProcess.events.length})</h4>
                    <div className="space-y-3">
                      {selectedProcess.events.map((event) => (
                        <div
                          key={event.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-primary"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                              {event.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                              )}
                            </div>
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {event.type}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            {event.user && <span>Por: {event.user.name}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documentos */}
                {selectedProcess.documents && selectedProcess.documents.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Documentos ({selectedProcess.documents.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedProcess.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-icons-outlined text-gray-400">description</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.fileName}</p>
                              {doc.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">{doc.description}</p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações de Data */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Criado em</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedProcess.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Última Atualização</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedProcess.lastUpdate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Atualizado em</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedProcess.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">Erro ao carregar detalhes do processo</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
