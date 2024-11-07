import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Comunidad } from '../../types/types';
import Modal from '../shared/Modal';
import QuickForm from '../shared/QuickForm';
import ResponsableForm from '../responsables/ResponsableForm';

interface ComunidadFormProps {
  onSuccess?: () => void;
  compact?: boolean;
  comunidad?: Comunidad;
}

export default function ComunidadForm({ onSuccess, compact, comunidad }: ComunidadFormProps) {
  const { state, dispatch } = useAppContext();
  const [showResponsableModal, setShowResponsableModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: comunidad?.nombre || '',
    direccion: comunidad?.direccion || '',
    capacidadDeposito: comunidad?.capacidadDeposito?.toString() || '',
    empleadoId: comunidad?.empleadoId || '',
    vecinoResponsableId: comunidad?.vecinoResponsableId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newComunidad: Comunidad = {
      id: comunidad?.id || crypto.randomUUID(),
      nombre: formData.nombre,
      direccion: formData.direccion,
      capacidadDeposito: Number(formData.capacidadDeposito),
      empleadoId: formData.empleadoId || undefined,
      vecinoResponsableId: formData.vecinoResponsableId || undefined
    };

    if (comunidad) {
      dispatch({ type: 'UPDATE_COMUNIDAD', payload: newComunidad });
    } else {
      dispatch({ type: 'ADD_COMUNIDAD', payload: newComunidad });
    }

    setFormData({
      nombre: '',
      direccion: '',
      capacidadDeposito: '',
      empleadoId: '',
      vecinoResponsableId: ''
    });

    onSuccess?.();
  };

  const formContent = (
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
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.direccion}
          onChange={(e) => setFormData({...formData, direccion: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Capacidad del Depósito (L)</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.capacidadDeposito}
          onChange={(e) => setFormData({...formData, capacidadDeposito: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Empleado Responsable</label>
        <QuickForm 
          onAdd={() => setShowResponsableModal(true)}
          showAddButton={true}
        >
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
            value={formData.empleadoId}
            onChange={(e) => setFormData({...formData, empleadoId: e.target.value})}
          >
            <option value="">Seleccionar empleado</option>
            {state.empleados?.filter(e => e.activo).map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre}
              </option>
            ))}
          </select>
        </QuickForm>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Vecino Responsable</label>
        <QuickForm 
          onAdd={() => setShowResponsableModal(true)}
          showAddButton={true}
        >
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
            value={formData.vecinoResponsableId}
            onChange={(e) => setFormData({...formData, vecinoResponsableId: e.target.value})}
          >
            <option value="">Seleccionar vecino</option>
            {state.vecinos?.map((vecino) => (
              <option key={vecino.id} value={vecino.id}>
                {vecino.nombre} ({vecino.cargo})
              </option>
            ))}
          </select>
        </QuickForm>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Building2 size={20} />
        <span>{comunidad ? 'Actualizar' : 'Añadir'} Comunidad</span>
      </button>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className={compact ? undefined : "bg-white rounded-lg shadow-md p-6"}>
        {!compact && <h3 className="text-xl font-semibold mb-4">Nueva Comunidad</h3>}
        {formContent}
      </form>

      <Modal
        isOpen={showResponsableModal}
        onClose={() => setShowResponsableModal(false)}
        title="Nuevo Responsable"
      >
        <ResponsableForm
          onSuccess={() => setShowResponsableModal(false)}
          compact
        />
      </Modal>
    </>
  );
}