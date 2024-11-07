import React, { useState } from 'react';
import { Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../shared/Modal';
import ConfirmDialog from '../shared/ConfirmDialog';
import ProveedorForm from './ProveedorForm';

export default function ProveedorList() {
  const { state, dispatch } = useAppContext();
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<string | null>(null);

  const handleEdit = (proveedor: any) => {
    setSelectedProveedor(proveedor);
    setShowEditModal(true);
  };

  const handleDelete = (proveedorId: string) => {
    setProveedorToDelete(proveedorId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (proveedorToDelete) {
      dispatch({ type: 'DELETE_PROVEEDOR', payload: proveedorToDelete });
      setProveedorToDelete(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Proveedores</h3>
      <div className="space-y-4">
        {state.proveedores.map((proveedor) => (
          <div key={proveedor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">{proveedor.nombre}</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Phone size={16} className="mr-1" />
                  {proveedor.telefono}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail size={16} className="mr-1" />
                  {proveedor.email}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(proveedor)}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(proveedor.id)}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {state.proveedores.length === 0 && (
          <p className="text-gray-500 text-center py-4">No hay proveedores registrados</p>
        )}
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Proveedor"
      >
        <ProveedorForm
          proveedor={selectedProveedor}
          onSuccess={() => setShowEditModal(false)}
          compact
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Eliminar Proveedor"
        message="¿Está seguro de que desea eliminar este proveedor? Esta acción no se puede deshacer."
      />
    </div>
  );
}