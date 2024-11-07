import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Usuario } from '../types/types';
import { getUsuarios, addUsuario, updateUsuario, deleteUsuario } from '../services/storage';
import { UserPlus, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import bcrypt from 'bcryptjs';

export default function UsuariosPage() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>(getUsuarios());
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    tipo: 'empleado',
    rol: 'usuario'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(formData.password, 10);
    
    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        ...formData,
        password: formData.password ? hashedPassword : editingUser.password
      };
      updateUsuario(editingUser.id, updatedUser);
    } else {
      const newUser: Usuario = {
        id: crypto.randomUUID(),
        ...formData,
        password: hashedPassword,
        activo: true,
        fechaInicio: new Date().toISOString(),
        intentosFallidos: 0
      };
      addUsuario(newUser);
    }
    
    setUsuarios(getUsuarios());
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      nombre: '',
      tipo: 'empleado',
      rol: 'usuario'
    });
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      username: usuario.username,
      password: '',
      nombre: usuario.nombre,
      tipo: usuario.tipo,
      rol: usuario.rol
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      deleteUsuario(id);
      setUsuarios(getUsuarios());
    }
  };

  const toggleActive = (usuario: Usuario) => {
    updateUsuario(usuario.id, { activo: !usuario.activo });
    setUsuarios(getUsuarios());
  };

  if (currentUser?.rol !== 'admin') {
    return <div>Acceso no autorizado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <UserPlus size={20} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{usuario.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{usuario.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{usuario.rol}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => toggleActive(usuario)}
                      className={`p-1 rounded-full ${
                        usuario.activo ? 'text-green-600 hover:bg-green-100' : 'text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {usuario.activo ? <UserCheck size={20} /> : <UserX size={20} />}
                    </button>
                    <button
                      onClick={() => handleEdit(usuario)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <Edit2 size={20} />
                    </button>
                    {usuario.id !== 'admin-1' && (
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {editingUser ? 'Nueva Contraseña (dejar en blanco para mantener)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="empleado">Empleado</option>
                  <option value="vecino">Vecino</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}