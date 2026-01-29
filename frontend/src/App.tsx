import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import DashboardOffice from './pages/DashboardOffice';
import DashboardClient from './pages/DashboardClient';
import ClientRegister from './pages/ClientRegister';
import ProcessTracking from './pages/ProcessTracking';
import ProcessMonitoring from './pages/ProcessMonitoring';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOffice />} />
            <Route path="dashboard/client/:clientId" element={<DashboardClient />} />
            <Route path="clients/new" element={<ClientRegister />} />
            <Route path="processes" element={<ProcessTracking />} />
            <Route path="monitoring" element={<ProcessMonitoring />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

