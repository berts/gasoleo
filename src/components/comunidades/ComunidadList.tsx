import React, { useState } from 'react';
import { Building2, User, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../shared/Modal';
import ConfirmDialog from '../shared/ConfirmDialog';
import ComunidadForm from './ComunidadForm';

export default function ComunidadList() {
  const { state, dispatch } = useAppContext();
  const [selectedComunidad, setSelectedComunidad] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [comunidadToDelete, setComunidadToDelete] = useState<string | null>(null);

  const getEmpleadoNombre = (empleadoId?: string) => {
    if (!empleadoId) return null;
    const empleado = state.empleados.find(e => e.id === empleadoId);
    return empleado ? empleado.nombre : 'No asignado';
  };

  const getVecinoResponsable = (vecinoId?: string) => {
    if (!vecinoId) return null;
    const vecino = state.vecinos.find(v => v.id === vecinoId);
    return vecino ? `${vecino.nombre} (${vecino.cargo})` : 'No asignado';
  };

  const handleEdit = (comunidad: any) => {
    setSelectedComunidad(comunidad);
    setShowEditModal(true);
  };

  const handleDelete = (comunidadId: string) => {
    setComunidadToDelete(comunidadId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (comunidadToDelete) {
      dispatch({ type: 'DELETE_COMUNIDAD', payload: comunidadToDelete });
      setComunidadToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Comunidades</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {state.comunidades.map((comunidad) => (
          <div key={comunidad.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Building2 className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-semibold">{comunidad.nombre}</p>
                  <p className="text-sm text-gray-500">{comunidad.direccion}</p>
                  <p className="text-sm text-gray-500">
                    Capacidad: {comunidad.capacidadDeposito.toLocaleString()} L
                  </p>
                  {getEmpleadoNombre(comunidad.empleadoId) && (
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <User size={16} className="mr-1" />
                      <span>Empleado: {getEmpleadoNombre(comunidad.empleadoId)}</span>
                    </div>
                  )}
                  {getVecinoResponsable(comunidad.vecinoResponsableId) && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <User size={16} className="mr-1" />
                      <span>Vecino: {getVecinoResponsable(comunidad.vecinoResponsableId)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(comunidad)}
                  className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(comunidad.id)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {state.comunidades.length === 0 && (
          <p className="text-gray-500 text-center py-4 md:col-span-2">
            No hay comunidades registradas
          </p>
        )}
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Comunidad"
      >
        <ComunidadForm
          comunidad={selectedComunidad}
          onSuccess={() => setShowEditModal(false)}
          compact
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Eliminar Comunidad"
        message="¿Está seguro de que desea eliminar esta comunidad? Esta acción no se puede deshacer."
      />
    </div>
  );
}