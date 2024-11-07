import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import CotizacionList from '../components/cotizaciones/CotizacionList';
import CotizacionForm from '../components/cotizaciones/CotizacionForm';
import Modal from '../components/shared/Modal';

export default function CotizacionesPage() {
  const [showFormModal, setShowFormModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Cotizaciones</h2>
        <button
          onClick={() => setShowFormModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Nueva Cotización</span>
        </button>
      </div>

      <CotizacionList />

      <Modal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        title="Nueva Cotización"
      >
        <CotizacionForm
          onSuccess={() => setShowFormModal(false)}
          compact
        />
      </Modal>
    </div>
  );
}