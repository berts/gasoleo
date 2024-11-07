import React from 'react';
import { User, Phone, Mail, Building2, Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Responsable } from '../../types/types';

export default function ResponsableList() {
  const { state, dispatch } = useAppContext();

  const getComunidadesAsignadas = (responsableId: string) => {
    return state.comunidades?.filter(com => com.responsableId === responsableId) || [];
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este responsable?')) {
      dispatch({ type: 'DELETE_RESPONSABLE', payload: id });
    }
  };

  const handleEdit = (responsable: Responsable) => {
    // TODO: Implement edit functionality
    console.log('Edit responsable:', responsable);
  };

  if (!state.responsables) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Responsables</h3>
        <p className="text-gray-500 text-center py-4">Cargando responsables...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Responsables</h3>
      <div className="space-y-4">
        {state.responsables.length > 0 ? (
          state.responsables.map((responsable) => {
            const comunidadesAsignadas = getComunidadesAsignadas(responsable.id);
            return (
              <div key={responsable.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <User size={20} className="text-blue-600" />
                    <p className="font-semibold">{responsable.nombre}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      responsable.tipo === 'empleado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {responsable.tipo}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    {responsable.telefono && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone size={16} className="mr-1" />
                        {responsable.telefono}
                      </div>
                    )}
                    {responsable.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail size={16} className="mr-1" />
                        {responsable.email}
                      </div>
                    )}
                  </div>
                  {comunidadesAsignadas.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Building2 size={16} className="mr-1" />
                        Comunidades asignadas: {comunidadesAsignadas.length}
                      </p>
                      <ul className="mt-1 text-sm text-gray-500">
                        {comunidadesAsignadas.map(com => (
                          <li key={com.id}>{com.nombre}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(responsable)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(responsable.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-4">No hay responsables registrados</p>
        )}
      </div>
    </div>
  );
}