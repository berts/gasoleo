import { jsPDF } from 'jspdf';

interface PedidoPDFData {
  id: string;
  fecha: string;
  fechaEntrega?: string;
  horaEntrega?: string;
  litros: number;
  precioLitro: number;
  precioMejorado?: boolean;
  precioOriginal?: number;
  total: number;
  estado: string;
  observaciones?: string;
  comunidadNombre: string;
  comunidadDireccion: string;
  proveedorNombre: string;
  proveedorTelefono: string;
  responsableNombre?: string;
  responsableTelefono?: string;
}

export function generatePedidoPDF(data: PedidoPDFData) {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  // Título
  doc.setFontSize(20);
  doc.text('Pedido de Gasóleo', margin, y);
  y += 15;

  // Información del pedido
  doc.setFontSize(12);
  doc.text(`Nº Pedido: ${data.id}`, margin, y);
  y += 10;
  doc.text(`Fecha: ${new Date(data.fecha).toLocaleDateString('es-ES')}`, margin, y);
  y += 15;

  // Comunidad
  doc.setFontSize(14);
  doc.text('Comunidad', margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(data.comunidadNombre, margin, y);
  y += 6;
  doc.text(data.comunidadDireccion, margin, y);
  y += 15;

  // Proveedor
  doc.setFontSize(14);
  doc.text('Proveedor', margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(data.proveedorNombre, margin, y);
  y += 6;
  doc.text(`Tel: ${data.proveedorTelefono}`, margin, y);
  y += 15;

  // Detalles del pedido
  doc.setFontSize(14);
  doc.text('Detalles del Pedido', margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.text(`Cantidad: ${data.litros.toLocaleString('es-ES')} litros`, margin, y);
  y += 6;
  doc.text(`Precio: ${data.precioLitro.toFixed(5)} €/L`, margin, y);
  if (data.precioMejorado && data.precioOriginal) {
    y += 6;
    doc.text(`Precio original: ${data.precioOriginal.toFixed(5)} €/L`, margin, y);
  }
  y += 6;
  doc.text(`Total: ${data.total.toFixed(2)} €`, margin, y);
  y += 6;
  if (data.fechaEntrega) {
    doc.text(`Fecha de entrega: ${new Date(data.fechaEntrega).toLocaleDateString('es-ES')}`, margin, y);
    y += 6;
  }
  if (data.horaEntrega) {
    doc.text(`Hora de entrega: ${data.horaEntrega}`, margin, y);
    y += 6;
  }
  doc.text(`Estado: ${data.estado}`, margin, y);
  y += 15;

  // Responsable de recogida
  if (data.responsableNombre) {
    doc.setFontSize(14);
    doc.text('Responsable de Recogida', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(data.responsableNombre, margin, y);
    y += 6;
    if (data.responsableTelefono) {
      doc.text(`Tel: ${data.responsableTelefono}`, margin, y);
      y += 6;
    }
    y += 9;
  }

  // Observaciones
  if (data.observaciones) {
    doc.setFontSize(14);
    doc.text('Observaciones', margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(data.observaciones, margin, y);
  }

  // Guardar el PDF
  doc.save(`pedido-${data.id}.pdf`);
}