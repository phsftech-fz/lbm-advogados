import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../config/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function DashboardClient() {
  const { clientId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchClientDashboard();
    }
  }, [clientId]);

  const fetchClientDashboard = async () => {
    try {
      const response = await api.get(`/dashboard/client/${clientId}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching client dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-6">Carregando...</div>;
  }

  const statusData = {
    labels: ['Em Andamento', 'Julgados', 'Suspensos'],
    datasets: [
      {
        data: [15, 6, 3],
        backgroundColor: ['#D30000', '#1A1A1A', '#E5E5E5'],
      },
    ],
  };

  const financeData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Causas Ganhas',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 20, 40, 38, 45],
        backgroundColor: '#D30000',
      },
      {
        label: 'Novas Causas',
        data: [10, 15, 12, 20, 18, 25, 22, 30, 15, 35, 30, 40],
        backgroundColor: '#1A1A1A',
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white dark:bg-surface-dark rounded shadow-sm border-l-4 border-primary p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="material-icons-outlined text-3xl text-primary">business</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{data.client.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">CNPJ: {data.client.cpfCnpj}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
              Cliente Ativo
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Processos Ativos</p>
          <h3 className="text-4xl font-light text-gray-900 dark:text-white mt-2">{data.activeProcesses || 0}</h3>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Taxa de Êxito</p>
          <h3 className="text-4xl font-light text-gray-900 dark:text-white mt-2">{data.successRate || 0}%</h3>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Audiências</p>
          <h3 className="text-4xl font-light text-gray-900 dark:text-white mt-2">{data.upcomingAudiences?.length || 0}</h3>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Risco Estimado</p>
          <h3 className="text-4xl font-light text-gray-900 dark:text-white mt-2">Baixo</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase mb-6">Status dos Processos</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%' }} />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark p-6 rounded shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase mb-6">Evolução Financeira</h3>
          <div className="h-64">
            <Bar data={financeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}

