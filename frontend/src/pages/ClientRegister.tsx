import { useState, useEffect } from 'react';
import api from '../config/api';

interface Client {
  id: string;
  type: 'PESSOA_FISICA' | 'PESSOA_JURIDICA';
  name: string;
  cpfCnpj: string;
  rgIe?: string;
  email?: string;
  phone?: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    processes: number;
  };
}

export default function ClientRegister() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    type: 'PESSOA_FISICA' as 'PESSOA_FISICA' | 'PESSOA_JURIDICA',
    name: '',
    cpfCnpj: '',
    rgIe: '',
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setFormData({
      type: 'PESSOA_FISICA',
      name: '',
      cpfCnpj: '',
      rgIe: '',
      email: '',
      phone: '',
      cep: '',
      street: '',
      number: '',
      city: '',
      state: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      type: client.type,
      name: client.name,
      cpfCnpj: client.cpfCnpj,
      rgIe: client.rgIe || '',
      email: client.email || '',
      phone: client.phone || '',
      cep: client.cep || '',
      street: client.street || '',
      number: client.number || '',
      city: client.city || '',
      state: client.state || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenDetailsModal = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  const handleOpenDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const clientData = {
        type: formData.type,
        name: formData.name,
        cpfCnpj: formData.cpfCnpj,
        rgIe: formData.rgIe || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        cep: formData.cep || undefined,
        street: formData.street || undefined,
        number: formData.number || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
      };

      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, clientData);
      } else {
        await api.post('/clients', clientData);
      }

      setShowModal(false);
      fetchClients();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      await api.delete(`/clients/${selectedClient.id}`);
      setShowDeleteModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir cliente');
      setShowDeleteModal(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpfCnpj.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Clientes</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Cadastre e gerencie seus clientes.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700 flex items-center gap-2"
          >
            <span className="material-icons-outlined text-[20px]">add</span>
            Novo Cliente
          </button>
        </div>

        {/* Busca */}
        <div className="mb-6">
          <div className="relative">
            <span className="material-icons-outlined absolute left-3 top-2.5 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Buscar por nome, CPF/CNPJ ou email..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="bg-surface-light dark:bg-surface-dark shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      CPF/CNPJ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Processos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        Nenhum cliente encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
                          <div className="text-xs text-gray-500">
                            {client.type === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{client.cpfCnpj}</div>
                          {client.rgIe && <div className="text-xs text-gray-500">{client.rgIe}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.email && (
                            <div className="text-sm text-gray-900 dark:text-white">{client.email}</div>
                          )}
                          {client.phone && (
                            <div className="text-xs text-gray-500">{client.phone}</div>
                          )}
                          {!client.email && !client.phone && (
                            <span className="text-xs text-gray-400">Não informado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {client._count?.processes || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              client.status === 'ATIVO'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenDetailsModal(client)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Ver detalhes"
                            >
                              <span className="material-icons-outlined text-[20px]">visibility</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(client)}
                              className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              title="Editar"
                            >
                              <span className="material-icons-outlined text-[20px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(client)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Excluir"
                            >
                              <span className="material-icons-outlined text-[20px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Cadastro/Edição */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Cliente
                    </label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="client-type"
                          value="PESSOA_FISICA"
                          checked={formData.type === 'PESSOA_FISICA'}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                          className="mr-2"
                        />
                        Pessoa Física
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="client-type"
                          value="PESSOA_JURIDICA"
                          checked={formData.type === 'PESSOA_JURIDICA'}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                          className="mr-2"
                        />
                        Pessoa Jurídica
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo / Razão Social *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF / CNPJ *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.cpfCnpj}
                        onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                        disabled={!!editingClient}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        RG / Inscrição Estadual
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.rgIe}
                        onChange={(e) => setFormData({ ...formData, rgIe: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CEP</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rua</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cidade</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white py-2.5 px-3"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-2 bg-primary text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : editingClient ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {showDetailsModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detalhes do Cliente</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nome</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo</label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {selectedClient.type === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CPF/CNPJ</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient.cpfCnpj}</p>
                  </div>
                  {selectedClient.rgIe && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        RG/Inscrição Estadual
                      </label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedClient.rgIe}</p>
                    </div>
                  )}
                  {selectedClient.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedClient.email}</p>
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Telefone</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedClient.phone}</p>
                    </div>
                  )}
                  {selectedClient.cep && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CEP</label>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedClient.cep}</p>
                    </div>
                  )}
                  {selectedClient.street && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Endereço</label>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedClient.street}
                        {selectedClient.number && `, ${selectedClient.number}`}
                        {selectedClient.city && ` - ${selectedClient.city}`}
                        {selectedClient.state && `/${selectedClient.state}`}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedClient.status === 'ATIVO'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {selectedClient.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Processos</label>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedClient._count?.processes || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Data de Cadastro
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleOpenEditModal(selectedClient);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red-700"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirmar Exclusão</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Tem certeza que deseja excluir o cliente <strong>{selectedClient.name}</strong>? Esta ação não pode
                  ser desfeita.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
