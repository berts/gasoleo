import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Fuel, 
  LayoutDashboard, 
  TrendingUp, 
  Truck, 
  Building2, 
  Users, 
  UserCircle2,
  LogOut,
  Settings 
} from 'lucide-react';

interface HeaderProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

export default function Header({ onPageChange, currentPage }: HeaderProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: TrendingUp },
    { id: 'pedidos', label: 'Pedidos', icon: Truck },
    { id: 'comunidades', label: 'Comunidades', icon: Building2 },
    { id: 'proveedores', label: 'Proveedores', icon: Users },
    { id: 'responsables', label: 'Responsables', icon: UserCircle2 }
  ];

  // Add usuarios page only for admin users
  if (user?.rol === 'admin') {
    navItems.push({ id: 'usuarios', label: 'Usuarios', icon: Settings });
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Fuel size={32} className="text-yellow-400" />
            <h1 className="text-2xl font-bold">GestGasóleo</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 hover:text-yellow-400 transition-colors ${
                    currentPage === item.id ? 'text-yellow-400' : ''
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.nombre}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden md:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}