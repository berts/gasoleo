import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Empleado, Vecino } from '../../types/types';

interface ResponsableFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export default function ResponsableForm({ onSuccess, compact }: ResponsableFormProps) {
  const { state, dispatch } = useAppContext();
  const [tipo, setTipo] = useState<'empleado' | 'vecino'>('empleado');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    cargo: 'presidente',
    comunidadId: '',
    fechaInicio: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === 'empleado') {
      const newEmpleado: Empleado = {
        id: crypto.randomUUID(),
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        activo: true
      };
      dispatch({ type: 'ADD_EMPLEADO', payload: newEmpleado });
    } else {
      const newVecino: Vecino = {
        id: crypto.randomUUID(),
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        cargo: formData.cargo as Vecino['cargo'],
        fechaInicio: formData.fechaInicio,
        comunidadId: formData.comunidadId
      };
      dispatch({ type: 'ADD_VECINO', payload: newVecino });
    }
    
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      cargo: 'presidente',
      comunidadId: '',
      fechaInicio: new Date().toISOString().split('T')[0]
    });
    onSuccess?.();
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as 'empleado' | 'vecino')}
          required
        >
          <option value="empleado">Empleado</option>
          <option value="vecino">Vecino Responsable</option>
        </select>
      </div>
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
          required
        />
      </div>
      {tipo === 'vecino' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cargo</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.cargo}
              onChange={(e) => setFormData({...formData, cargo: e.target.value})}
              required
            >
              <option value="presidente">Presidente</option>
              <option value="vicepresidente">Vicepresidente</option>
              <option value="secretario">Secretario</option>
              <option value="tesorero">Tesorero</option>
              <option value="vocal">Vocal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comunidad</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.comunidadId}
              onChange={(e) => setFormData({...formData, comunidadId: e.target.value})}
              required
            >
              <option value="">Seleccionar comunidad</option>
              {state.comunidades.map((comunidad) => (
                <option key={comunidad.id} value={comunidad.id}>
                  {comunidad.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.fechaInicio}
              onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
              required
            />
          </div>
        </>
      )}
      <button
        type="submit"
        className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <UserPlus size={20} />
        <span>Añadir {tipo === 'empleado' ? 'Empleado' : 'Vecino Responsable'}</span>
      </button>
    </div>
  );

  if (compact) {
    return <form onSubmit={handleSubmit}>{formContent}</form>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Nuevo Responsable</h3>
      {formContent}
    </form>
  );
}