import * as storage from './storage';
import bcrypt from 'bcryptjs';

export async function initDB() {
  storage.initializeStorage();
}

export async function getUsuarioByUsername(username: string) {
  const usuarios = storage.getUsuarios();
  return usuarios.find(u => u.username === username);
}

export async function updateIntentosFallidos(username: string, intentos: number, bloqueadoHasta?: string) {
  const usuario = await getUsuarioByUsername(username);
  if (usuario) {
    storage.updateUsuario(usuario.id, {
      intentosFallidos: intentos,
      bloqueadoHasta
    });
  }
}

export async function getAllProveedores() {
  return storage.getProveedores();
}

export async function getAllCotizaciones() {
  return storage.getCotizaciones();
}

export async function getAllComunidades() {
  return storage.getComunidades();
}

export async function getAllPedidos() {
  return storage.getPedidos();
}

export async function getAllEmpleados() {
  return storage.getEmpleados();
}

export async function getAllVecinos() {
  return storage.getVecinos();
}

// Inicializar la base de datos
initDB().catch(console.error);