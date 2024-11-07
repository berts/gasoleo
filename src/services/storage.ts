import { Proveedor, Cotizacion, Pedido, Comunidad, Empleado, Vecino, Usuario } from '../types/types';

export interface StorageData {
  proveedores: Proveedor[];
  cotizaciones: Cotizacion[];
  pedidos: Pedido[];
  comunidades: Comunidad[];
  empleados: Empleado[];
  vecinos: Vecino[];
  usuarios: Usuario[];
}

const STORAGE_KEY = 'app_data';

const defaultAdmin: Usuario = {
  id: 'admin-1',
  username: 'admin',
  password: '$2a$10$8Ux7YyXkIOPx6pXeKVQK8O0RrTXJYpqpjpOE.VAYf0M3MRkxlJZe6', // "admin123"
  nombre: 'Administrador',
  tipo: 'empleado',
  rol: 'admin',
  activo: true,
  fechaInicio: new Date().toISOString(),
  intentosFallidos: 0
};

const initialData: StorageData = {
  proveedores: [
    {
      id: 'repsol-1',
      nombre: 'Repsol',
      telefono: '900 000 000',
      email: 'ventas@repsol.com'
    },
    {
      id: 'cepsa-1',
      nombre: 'Cepsa',
      telefono: '900 111 111',
      email: 'ventas@cepsa.com'
    }
  ],
  cotizaciones: [
    {
      id: 'cot-1',
      proveedorId: 'repsol-1',
      fecha: new Date().toISOString(),
      fechaSuministro: new Date().toISOString(),
      precioLitro: 1.092,
      observaciones: 'Precio base marzo 2024'
    },
    {
      id: 'cot-2',
      proveedorId: 'cepsa-1',
      fecha: new Date().toISOString(),
      fechaSuministro: new Date().toISOString(),
      precioLitro: 1.087,
      observaciones: 'Precio base marzo 2024'
    }
  ],
  pedidos: [],
  comunidades: [],
  empleados: [
    {
      id: 'emp-1',
      nombre: 'Juan Pérez',
      telefono: '600 000 000',
      email: 'juan@empresa.com',
      activo: true
    }
  ],
  vecinos: [],
  usuarios: [defaultAdmin]
};

export function loadData(): StorageData {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      saveData(initialData);
      return initialData;
    }
    const parsedData = JSON.parse(savedData);
    // Ensure admin user always exists
    if (!parsedData.usuarios?.some(u => u.username === 'admin')) {
      parsedData.usuarios = [...(parsedData.usuarios || []), defaultAdmin];
      saveData(parsedData);
    }
    return parsedData;
  } catch (error) {
    console.error('Error loading data:', error);
    return initialData;
  }
}

export function saveData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// User management functions
export function getUsuarios(): Usuario[] {
  const data = loadData();
  return data.usuarios || [];
}

export function addUsuario(usuario: Usuario): void {
  const data = loadData();
  data.usuarios = [...(data.usuarios || []), usuario];
  saveData(data);
}

export function updateUsuario(id: string, updates: Partial<Usuario>): void {
  const data = loadData();
  data.usuarios = data.usuarios.map(u => 
    u.id === id ? { ...u, ...updates } : u
  );
  saveData(data);
}

export function deleteUsuario(id: string): void {
  const data = loadData();
  // Prevent deleting the default admin
  if (id === 'admin-1') return;
  data.usuarios = data.usuarios.filter(u => u.id !== id);
  saveData(data);
}

export function getUsuarioByUsername(username: string): Usuario | undefined {
  const data = loadData();
  return data.usuarios?.find(u => u.username === username);
}