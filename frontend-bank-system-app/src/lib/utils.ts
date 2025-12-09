import { format, parseISO } from 'date-fns';

/**
 * Format currency in IDR
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'dd MMM yyyy HH:mm');
  } catch {
    return dateString;
  }
}

/**
 * Format date for datetime-local input
 */
export function formatDateTimeLocal(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert datetime-local input to ISO string
 */
export function dateTimeLocalToISO(dateTimeLocal: string): string {
  return new Date(dateTimeLocal).toISOString();
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Class name helper (simple version of clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}