import React from 'react';
import ComunidadForm from '../components/comunidades/ComunidadForm';
import ComunidadList from '../components/comunidades/ComunidadList';

export default function ComunidadesPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ComunidadForm />
        </div>
        <div className="lg:col-span-2">
          <ComunidadList />
        </div>
      </div>
    </div>
  );
}