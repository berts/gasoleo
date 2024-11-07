import React, { useState } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import CotizacionesPage from '../pages/CotizacionesPage';
import PedidosPage from '../pages/PedidosPage';
import ComunidadesPage from '../pages/ComunidadesPage';
import ProveedoresPage from '../pages/ProveedoresPage';
import ResponsablesPage from '../pages/ResponsablesPage';
import UsuariosPage from '../pages/UsuariosPage';
import { useAuth } from '../context/AuthContext';

export default function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'cotizaciones':
        return <CotizacionesPage />;
      case 'pedidos':
        return <PedidosPage />;
      case 'comunidades':
        return <ComunidadesPage />;
      case 'proveedores':
        return <ProveedoresPage />;
      case 'responsables':
        return <ResponsablesPage />;
      case 'usuarios':
        return user?.rol === 'admin' ? <UsuariosPage /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onPageChange={setCurrentPage} currentPage={currentPage} />
      <main className="container mx-auto py-6 px-4">
        {renderPage()}
      </main>
    </div>
  );
}