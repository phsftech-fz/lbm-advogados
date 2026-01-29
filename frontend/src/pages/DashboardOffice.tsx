import { useEffect, useState } from 'react';
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

interface DashboardData {
  totalProcesses: number;
  processesWithDeadlines: number;
  monthlyAudiences: number;
  finishedProcesses: number;
  recentProcesses: any[];
  areaDistribution: any[];
}

export default function DashboardOffice() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard/office');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  const financeData = {
    labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
    datasets: [
      {
        label: 'Faturamento',
        data: [120000, 150000, 180000, 140000, 190000, 210000],
        backgroundColor: '#D30000',
      },
      {
        label: 'Despesas',
        data: [80000, 90000, 95000, 85000, 100000, 98000],
        backgroundColor: '#1F2937',
      },
    ],
  };

  const areaData = {
    labels: ['Cível', 'Trabalhista', 'Tributário', 'Outros'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ['#D30000', '#1F2937', '#9CA3AF', '#E5E7EB'],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <header className="bg-surface-light dark:bg-surface-dark shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Painel de Controle</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bem-vindo de volta.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border-l-4 border-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Processos Ativos</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{data?.totalProcesses || 0}</h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="material-icons-outlined text-primary">folder_open</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Prazos Hoje</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{data?.processesWithDeadlines || 0}</h3>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="material-icons-outlined text-yellow-500">warning</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Audiências este mês</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{data?.monthlyAudiences || 0}</h3>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="material-icons-outlined text-blue-500">event</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Finalizados (30d)</p>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{data?.finishedProcesses || 0}</h3>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="material-icons-outlined text-green-500">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Desempenho Financeiro</h2>
          <div className="h-64">
            <Bar data={financeData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Distribuição por Área</h2>
          <div className="h-48 flex justify-center">
            <Doughnut data={areaData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

