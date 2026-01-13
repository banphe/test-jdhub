import { db } from '../../config/firebase-init.js';
import { collection, getDocs, addDoc, doc, setDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { COLLECTIONS } from '../../config/constants.js';
import { generateMockRooms, generateMockCustomers, generateMockBookings } from '../../../shared/mocks/calendar-data.js';

/**
 * Repository dla danych kalendarza.
 * Odpowiada za źródło danych - mock lub Firebase.
 * 
 * Przełącznik USE_MOCK kontroluje skąd pochodzą dane:
 * - true: zwraca dane z mocka (development)
 * - false: pobiera z Firebase Firestore (production)
 */
export default class CalendarRepository {
  
  static USE_MOCK = false; // ← Przełącznik mock/Firebase
  
  /**
   * Zwraca listę pokoi.
   */
  static async getRooms() {
    if (this.USE_MOCK) {
      return generateMockRooms();
    } else {
      return await this.#getRoomsFromFirebase();
    }
  }
  
  /**
   * Zwraca listę klientów.
   */
  static async getCustomers() {
    if (this.USE_MOCK) {
      return generateMockCustomers();
    } else {
      return await this.#getCustomersFromFirebase();
    }
  }
  
  /**
   * Zwraca listę rezerwacji.
   */
  static async getBookings() {
    if (this.USE_MOCK) {
      return generateMockBookings();
    } else {
      return await this.#getBookingsFromFirebase();
    }
  }
  
  // ==================== FIREBASE DATA ====================
  
  static async #getRoomsFromFirebase() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.ROOMS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching rooms from Firebase:', error);
      throw error;
    }
  }
  
  static async #getCustomersFromFirebase() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.CUSTOMERS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching customers from Firebase:', error);
      throw error;
    }
  }
  
  static async #getBookingsFromFirebase() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching bookings from Firebase:', error);
      throw error;
    }
  }

  // ==================== WRITE OPERATIONS ====================

  /**
   * Zapisuje nową rezerwację do Firebase.
   * @param {Object} bookingData - Dane rezerwacji (format z parseBooksy)
   * @returns {Promise<string>} - ID utworzonej rezerwacji
   */
  static async saveBooking(bookingData) {
    try {
      const bookingToSave = {
        ...bookingData,
        start: new Timestamp(bookingData.start._seconds, bookingData.start._nanoseconds),
        end: new Timestamp(bookingData.end._seconds, bookingData.end._nanoseconds),
        createdAt: new Timestamp(bookingData.createdAt._seconds, bookingData.createdAt._nanoseconds)
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), bookingToSave);
      return docRef.id;
    } catch (error) {
      console.error('Error saving booking to Firebase:', error);
      throw error;
    }
  }

  /**
   * Zapisuje nowego klienta do Firebase.
   * @param {string} customerId - ID klienta (numer telefonu znormalizowany)
   * @param {Object} customerData - Dane klienta { firstName, lastName, createdAt }
   * @returns {Promise<void>}
   */
  static async saveCustomer(customerId, customerData) {
    try {
      await setDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId), customerData);
    } catch (error) {
      console.error('Error saving customer to Firebase:', error);
      throw error;
    }
  }
}
