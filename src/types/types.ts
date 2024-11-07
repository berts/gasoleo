export interface Proveedor {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
}

export interface Cotizacion {
  id: string;
  proveedorId: string;
  fecha: string;
  fechaSuministro: string;
  precioLitro: number;
  observaciones?: string;
}

export interface Pedido {
  id: string;
  fecha: string;
  proveedorId: string;
  comunidadId: string;
  responsableId: string;
  litros: number;
  precioLitro: number;
  precioMejorado?: number;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'entregado';
  fechaEntrega?: string;
  horaEntrega?: string;
  observaciones?: string;
}

export interface Comunidad {
  id: string;
  nombre: string;
  direccion: string;
  capacidadDeposito: number;
  responsableId: string;
}

export interface Empleado {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  activo: boolean;
}

export interface Vecino {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  comunidadId: string;
  fechaInicio: string;
  fechaFin?: string;
}

export interface Usuario {
  id: string;
  username: string;
  password: string;
  nombre: string;
  tipo: 'empleado' | 'vecino';
  rol: 'admin' | 'usuario';
  activo: boolean;
  fechaInicio: string;
  intentosFallidos: number;
}