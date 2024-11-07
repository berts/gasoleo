import React from 'react';
import PedidoForm from '../components/pedidos/PedidoForm';
import PedidoList from '../components/pedidos/PedidoList';

export default function PedidosPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PedidoForm />
        </div>
        <div className="lg:col-span-2">
          <PedidoList />
        </div>
      </div>
    </div>
  );
}