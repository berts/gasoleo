import React, { useState } from 'react';
import { Calendar, Truck, CheckCircle, Building2, Clock, FileText, User, AlertCircle, Edit, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { generatePedidoPDF } from '../../utils/pdfGenerator';
import Modal from '../shared/Modal';
import PedidoForm from './PedidoForm';

export default function PedidoList() {
  const { state, dispatch } = useAppContext();
  const [editingPedido, setEditingPedido] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<any>(null);

  const getProveedorNombre = (proveedorId: string) => {
    const proveedor = state.proveedores.find(p => p.id === proveedorId);
    return proveedor ? proveedor.nombre : 'Desconocido';
  };

  const getComunidadNombre = (comunidadId: string) => {
    const comunidad = state.comunidades.find(c => c.id === comunidadId);
    return comunidad ? comunidad.nombre : 'Desconocida';
  };

  const getResponsableNombre = (responsableId?: string) => {
    if (!responsableId) return null;
    const empleado = state.empleados.find(e => e.id === responsableId);
    if (empleado) return `${empleado.nombre} (Empleado)`;
    const vecino = state.vecinos.find(v => v.id === responsableId);
    if (vecino) return `${vecino.nombre} (${vecino.cargo})`;
    return 'Desconocido';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'confirmado': return 'text-green-600';
      case 'pendiente': return 'text-yellow-600';
      case 'entregado': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleGeneratePDF = async (pedido: any) => {
    const comunidad = state.comunidades.find(c => c.id === pedido.comunidadId);
    const proveedor = state.proveedores.find(p => p.id === pedido.proveedorId);
    const responsable = pedido.responsableRecogida ? 
      (state.empleados.find(e => e.id === pedido.responsableRecogida) ||
       state.vecinos.find(v => v.id === pedido.responsableRecogida)) : null;

    await generatePedidoPDF({
      ...pedido,
      comunidadNombre: comunidad?.nombre || 'Desconocida',
      comunidadDireccion: comunidad?.direccion || '',
      proveedorNombre: proveedor?.nombre || 'Desconocido',
      proveedorTelefono: proveedor?.telefono || '',
      responsableNombre: responsable?.nombre || '',
      responsableTelefono: responsable?.telefono || ''
    });
  };

  const handleEditPedido = (pedido: any) => {
    setSelectedPedido(pedido);
    setShowEditModal(true);
  };

  const handleUpdateEstado = (pedidoId: string, nuevoEstado: 'pendiente' | 'confirmado' | 'entregado') => {
    const pedido = state.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      dispatch({
        type: 'UPDATE_PEDIDO',
        payload: {
          ...pedido,
          estado: nuevoEstado,
          ...(nuevoEstado === 'entregado' ? { fechaEntregaReal: new Date().toISOString() } : {})
        }
      });
    }
  };

  const pedidosOrdenados = [...state.pedidos].sort((a, b) => {
    if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1;
    if (a.estado !== 'pendiente' && b.estado === 'pendiente') return 1;
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  const EstadoDropdown = ({ pedido }: { pedido: any }) => (
    <select
      value={pedido.estado}
      onChange={(e) => handleUpdateEstado(pedido.id, e.target.value as any)}
      className={`text-sm font-medium rounded-md border-0 bg-transparent ${getEstadoColor(pedido.estado)}`}
    >
      <option value="pendiente" className="text-yellow-600">Pendiente</option>
      <option value="confirmado" className="text-green-600">Confirmado</option>
      <option value="entregado" className="text-blue-600">Entregado</option>
    </select>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Pedidos</h3>
      <div className="space-y-4">
        {pedidosOrdenados.map((pedido) => (
          <div key={pedido.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <Truck className={getEstadoColor(pedido.estado)} size={20} />
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 size={16} className="text-gray-400" />
                    <p className="font-semibold">{getComunidadNombre(pedido.comunidadId)}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {pedido.litros}L - {getProveedorNombre(pedido.proveedorId)}
                  </p>
                  <p className="text-sm font-medium text-gray-600 flex items-center">
                    Precio: {pedido.precioLitro.toFixed(3)} €/L
                    {pedido.precioMejorado && (
                      <>
                        <AlertCircle className="w-4 h-4 ml-1 text-green-600" />
                        <span className="text-green-600 ml-1">
                          (Original: {pedido.precioOriginal?.toFixed(3)} €/L)
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-sm font-medium text-gray-600">
                    Total: {pedido.total.toFixed(2)} €
                  </p>
                  {pedido.responsableRecogida && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <User size={14} className="mr-1" />
                      Recoge: {getResponsableNombre(pedido.responsableRecogida)}
                    </p>
                  )}
                  {pedido.observaciones && (
                    <p className="text-sm text-gray-500 mt-1">
                      Obs: {pedido.observaciones}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="font-semibold">
                  {pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toLocaleDateString() : 'Sin fecha'}
                </p>
              </div>
              {pedido.horaEntrega && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{pedido.horaEntrega}</span>
                </div>
              )}
              <div className="mt-1">
                <EstadoDropdown pedido={pedido} />
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEditPedido(pedido)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Edit size={14} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleGeneratePDF(pedido)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <FileText size={14} />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {state.pedidos.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No hay pedidos registrados
          </p>
        )}
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Pedido"
      >
        <PedidoForm
          pedido={selectedPedido}
          onSuccess={() => setShowEditModal(false)}
          compact
        />
      </Modal>
    </div>
  );
}