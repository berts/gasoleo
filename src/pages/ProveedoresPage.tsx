import React from 'react';
import ProveedorForm from '../components/proveedores/ProveedorForm';
import ProveedorList from '../components/proveedores/ProveedorList';

export default function ProveedoresPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProveedorForm />
        </div>
        <div className="lg:col-span-2">
          <ProveedorList />
        </div>
      </div>
    </div>
  );
}