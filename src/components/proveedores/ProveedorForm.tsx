import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Proveedor } from '../../types/types';

export default function ProveedorForm() {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProveedor: Proveedor = {
      id: crypto.randomUUID(),
      ...formData
    };
    dispatch({ type: 'ADD_PROVEEDOR', payload: newProveedor });
    setFormData({ nombre: '', telefono: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Nuevo Proveedor</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            pattern="[0-9]{9}"
            placeholder="123456789"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.telefono}
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          <span>Añadir Proveedor</span>
        </button>
      </div>
    </form>
  );
}