import React, { useState, useEffect } from 'react';
import { Truck, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Pedido } from '../../types/types';

export default function PedidoForm() {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    comunidadId: '',
    proveedorId: '',
    litros: '',
    fechaSuministro: '',
    hora: '',
    observaciones: '',
    responsableId: '',
    precioMejorado: false,
    nuevoPrecio: ''
  });

  const [precioSuministro, setPrecioSuministro] = useState<number | null>(null);

  useEffect(() => {
    if (formData.proveedorId && formData.fechaSuministro) {
      const cotizaciones = state.cotizaciones || [];
      const cotizacionesFiltradas = cotizaciones
        .filter(c => c.proveedorId === formData.proveedorId)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      const cotizacionParaFecha = cotizacionesFiltradas.find(
        c => new Date(c.fecha) <= new Date(formData.fechaSuministro)
      );

      if (cotizacionParaFecha) {
        setPrecioSuministro(cotizacionParaFecha.precioLitro);
      } else if (cotizacionesFiltradas.length > 0) {
        setPrecioSuministro(cotizacionesFiltradas[0].precioLitro);
      } else {
        setPrecioSuministro(null);
      }
    } else {
      setPrecioSuministro(null);
    }
  }, [formData.proveedorId, formData.fechaSuministro, state.cotizaciones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!precioSuministro && !formData.precioMejorado) {
      alert('No hay precio disponible para la fecha seleccionada');
      return;
    }

    const newPedido: Pedido = {
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      proveedorId: formData.proveedorId,
      litros: Number(formData.litros),
      precioLitro: formData.precioMejorado ? Number(formData.nuevoPrecio) : precioSuministro!,
      total: formData.precioMejorado 
        ? Number(formData.litros) * Number(formData.nuevoPrecio)
        : Number(formData.litros) * precioSuministro!,
      estado: 'pendiente',
      fechaSuministro: formData.fechaSuministro,
      hora: formData.hora,
      observaciones: formData.observaciones,
      responsableId: formData.responsableId
    };

    dispatch({ type: 'ADD_PEDIDO', payload: newPedido });
    setFormData({
      comunidadId: '',
      proveedorId: '',
      litros: '',
      fechaSuministro: '',
      hora: '',
      observaciones: '',
      responsableId: '',
      precioMejorado: false,
      nuevoPrecio: ''
    });
  };

  if (!state.comunidades || !state.proveedores || !state.responsables) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Nuevo Pedido</h3>
        <p className="text-gray-500 text-center py-4">Cargando datos...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Nuevo Pedido</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Comunidad</label>
          <div className="mt-1 flex items-center space-x-2">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800"
              title="Nueva comunidad"
              onClick={() => dispatch({ type: 'SHOW_MODAL', payload: 'NUEVA_COMUNIDAD' })}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Proveedor</label>
          <div className="mt-1 flex items-center space-x-2">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800"
              title="Nuevo proveedor"
              onClick={() => dispatch({ type: 'SHOW_MODAL', payload: 'NUEVO_PROVEEDOR' })}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Litros</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.litros}
            onChange={(e) => setFormData({...formData, litros: e.target.value})}
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
          <label className="block text-sm font-medium text-gray-700">Hora de Suministro</label>
          <input
            type="time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.hora}
            onChange={(e) => setFormData({...formData, hora: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Responsable de Recogida</label>
          <div className="mt-1 flex items-center space-x-2">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.responsableId}
              onChange={(e) => setFormData({...formData, responsableId: e.target.value})}
              required
            >
              <option value="">Seleccionar responsable</option>
              {state.responsables.map((responsable) => (
                <option key={responsable.id} value={responsable.id}>
                  {responsable.nombre} ({responsable.tipo})
                </option>
              ))}
            </select>
            <button
              type="button"
              className="p-2 text-blue-600 hover:text-blue-800"
              title="Nuevo responsable"
              onClick={() => dispatch({ type: 'SHOW_MODAL', payload: 'NUEVO_RESPONSABLE' })}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {precioSuministro !== null && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-700">
              Precio: {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 5 }).format(precioSuministro)} €/L
            </p>
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={formData.precioMejorado}
                  onChange={(e) => setFormData({...formData, precioMejorado: e.target.checked})}
                />
                <span className="ml-2 text-sm text-gray-600">Precio mejorado</span>
              </label>
            </div>
            {formData.precioMejorado && (
              <div className="mt-2">
                <input
                  type="number"
                  step="0.00001"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.nuevoPrecio}
                  onChange={(e) => setFormData({...formData, nuevoPrecio: e.target.value})}
                  placeholder="Nuevo precio por litro"
                  required={formData.precioMejorado}
                />
              </div>
            )}
          </div>
        )}

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
          <Truck size={20} />
          <span>Crear Pedido</span>
        </button>
      </div>
    </form>
  );
}