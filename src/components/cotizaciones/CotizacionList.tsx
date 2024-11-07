import React, { useState } from 'react';
import { Calendar, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatCurrency } from '../../utils/formatters';
import Modal from '../shared/Modal';
import CotizacionForm from './CotizacionForm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CotizacionList() {
  const { state, dispatch } = useAppContext();
  const [editingCotizacion, setEditingCotizacion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta cotización?')) {
      dispatch({ type: 'DELETE_COTIZACION', payload: id });
    }
  };

  const getProveedorNombre = (id: string) => {
    return state.proveedores.find(p => p.id === id)?.nombre || 'Desconocido';
  };

  // Prepare data for chart
  const chartData = {
    labels: [...new Set(state.cotizaciones.map(c => c.fechaSuministro))].sort(),
    datasets: state.proveedores.map((proveedor, index) => ({
      label: proveedor.nombre,
      data: state.cotizaciones
        .filter(c => c.proveedorId === proveedor.id)
        .map(c => ({
          x: c.fechaSuministro,
          y: c.precioLitro
        })),
      borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
      tension: 0.1,
      fill: false
    }))
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución de Precios por Proveedor'
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: number) => `${value.toFixed(5)} €`
        }
      }
    }
  };

  const averagePrice = state.cotizaciones.length > 0
    ? state.cotizaciones.reduce((acc, curr) => acc + curr.precioLitro, 0) / state.cotizaciones.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Cotizaciones</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp size={20} />
              <span className="font-semibold">
                Precio medio: {formatCurrency(averagePrice)} €/L
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Suministro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.cotizaciones.map((cotizacion) => (
                  <tr key={cotizacion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {getProveedorNombre(cotizacion.proveedorId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold">
                        {formatCurrency(cotizacion.precioLitro)} €/L
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        {new Date(cotizacion.fechaSuministro).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setEditingCotizacion(cotizacion);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cotizacion.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6">Gráfico de Precios</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCotizacion(null);
        }}
        title="Editar Cotización"
      >
        <CotizacionForm
          cotizacion={editingCotizacion}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingCotizacion(null);
          }}
          compact
        />
      </Modal>
    </div>
  );
}