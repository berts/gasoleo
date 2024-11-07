export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  }).format(value);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as Spanish phone number
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  return phone;
}

export function validatePhoneNumber(phone: string): boolean {
  // Spanish phone number format (9 digits, can start with 6, 7, 8, or 9)
  const regex = /^[6789]\d{8}$/;
  return regex.test(phone.replace(/\D/g, ''));
}

export function validateEmail(email: string | undefined): boolean {
  if (!email) return true; // Email is optional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}