import React from 'react';
import { TrendingUp, Building2, Truck, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import PriceChart from './shared/PriceChart';

export default function Dashboard() {
  const { state } = useAppContext();

  const calcularPrecioMedio = () => {
    if (!state.cotizaciones?.length) return 0;
    const total = state.cotizaciones.reduce((sum, cot) => sum + cot.precioLitro, 0);
    return total / state.cotizaciones.length;
  };

  const getUltimasCotizaciones = () => {
    return [...(state.cotizaciones || [])]
      .sort((a, b) => new Date(b.fechaSuministro).getTime() - new Date(a.fechaSuministro).getTime())
      .slice(0, 3);
  };

  const getProximasEntregas = () => {
    return [...(state.pedidos || [])]
      .filter(p => p.estado !== 'entregado')
      .sort((a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime())
      .slice(0, 2);
  };

  const getProveedorNombre = (id: string) => {
    return state.proveedores?.find(p => p.id === id)?.nombre || 'Desconocido';
  };

  const getComunidadNombre = (id: string) => {
    return state.comunidades?.find(c => c.id === id)?.nombre || 'Desconocida';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Panel de Control</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Precio Medio Actual</p>
              <p className="text-2xl font-bold">{formatCurrency(calcularPrecioMedio())} €/L</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Comunidades</p>
              <p className="text-2xl font-bold">{state.comunidades?.length || 0}</p>
            </div>
            <Building2 className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Proveedores</p>
              <p className="text-2xl font-bold">{state.proveedores?.length || 0}</p>
            </div>
            <Truck className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pedidos Pendientes</p>
              <p className="text-2xl font-bold">
                {state.pedidos?.filter(p => p.estado !== 'entregado').length || 0}
              </p>
            </div>
            <Calendar className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Últimas Cotizaciones</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Proveedor</th>
                  <th className="text-left py-3">Precio</th>
                  <th className="text-left py-3">Fecha Suministro</th>
                </tr>
              </thead>
              <tbody>
                {getUltimasCotizaciones().map((cotizacion) => (
                  <tr key={`${cotizacion.id}-${cotizacion.fecha}`} className="border-b">
                    <td className="py-3">{getProveedorNombre(cotizacion.proveedorId)}</td>
                    <td className="py-3">{formatCurrency(cotizacion.precioLitro)} €/L</td>
                    <td className="py-3">{new Date(cotizacion.fechaSuministro).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Evolución de Precios</h3>
          <div className="h-[300px]">
            <PriceChart />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Próximas Entregas</h3>
          <div className="space-y-4">
            {getProximasEntregas().map((pedido) => (
              <div key={`${pedido.id}-${pedido.fecha}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{getComunidadNombre(pedido.comunidadId)}</p>
                  <p className="text-sm text-gray-500">
                    {pedido.litros}L - {getProveedorNombre(pedido.proveedorId)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {new Date(pedido.fechaEntrega).toLocaleDateString()}
                  </p>
                  <p className={`text-sm ${
                    pedido.estado === 'confirmado' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}