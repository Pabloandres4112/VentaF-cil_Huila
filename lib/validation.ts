export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidWhatsappNumber(value: string): boolean {
  return /^\d{10,15}$/.test(value.trim());
}
