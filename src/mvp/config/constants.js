/**
 * Stałe projektu - nazwy kolekcji Firestore, statusy, etc.
 * Używane przez repositories aby uniknąć magic strings.
 */

export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  CUSTOMERS: 'customers',
  ROOMS: 'rooms',
  THERAPISTS: 'therapists',
  MENU: 'menu'
};

export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  NOSHOW: 'noshow'
};
