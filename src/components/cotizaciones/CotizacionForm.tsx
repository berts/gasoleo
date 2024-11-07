import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Cotizacion } from '../../types/types';
import Modal from '../shared/Modal';
import QuickForm from '../shared/QuickForm';
import ProveedorForm from '../proveedores/ProveedorForm';

interface CotizacionFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export default function CotizacionForm({ onSuccess, compact }: CotizacionFormProps) {
  const { state, dispatch } = useAppContext();
  const [showProveedorModal, setShowProveedorModal] = useState(false);
  const [formData, setFormData] = useState({
    proveedorId: '',
    precioLitro: '',
    fechaSuministro: '',
    observaciones: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCotizacion: Cotizacion = {
      id: crypto.randomUUID(),
      proveedorId: formData.proveedorId,
      fecha: new Date().toISOString(),
      fechaSuministro: formData.fechaSuministro,
      precioLitro: Number(formData.precioLitro),
      observaciones: formData.observaciones
    };
    dispatch({ type: 'ADD_COTIZACION', payload: newCotizacion });
    setFormData({ proveedorId: '', precioLitro: '', fechaSuministro: '', observaciones: '' });
    onSuccess?.();
  };

  const handleProveedorSuccess = () => {
    setShowProveedorModal(false);
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Proveedor</label>
        <QuickForm 
          onAdd={() => setShowProveedorModal(true)}
          showAddButton={true}
        >
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
            value={formData.proveedorId}
            onChange={(e) => setFormData({...formData, proveedorId: e.target.value})}
            required
          >
            <option value="">Seleccionar proveedor</option>
            {state.proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </QuickForm>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio por Litro (€)</label>
        <input
          type="number"
          step="0.00001"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.precioLitro}
          onChange={(e) => setFormData({...formData, precioLitro: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de Suministro</label>
        <input
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.fechaSuministro}
          onChange={(e) => setFormData({...formData, fechaSuministro: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.observaciones}
          onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        <PlusCircle size={20} />
        <span>Añadir Cotización</span>
      </button>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className={compact ? undefined : "bg-white rounded-lg shadow-md p-6"}>
        {!compact && <h3 className="text-xl font-semibold mb-4">Nueva Cotización</h3>}
        {formContent}
      </form>

      <Modal
        isOpen={showProveedorModal}
        onClose={() => setShowProveedorModal(false)}
        title="Nuevo Proveedor"
      >
        <ProveedorForm
          onSuccess={handleProveedorSuccess}
          compact
        />
      </Modal>
    </>
  );
}