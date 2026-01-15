import { db } from '../../config/firebase-init.js';
import { collection, getDocs, addDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

/**
 * Zunifikowane repository dla wszystkich danych aplikacji.
 * Eliminuje duplikację między CalendarRepository, ReportRepository i TherapistRepository.
 * Obsługuje wyłącznie Firebase Firestore.
 */
export default class DataRepository {
  
  // ==================== READ OPERATIONS ====================
  
  static async getBookings() {
    return await this.#fetchCollection(COLLECTIONS.BOOKINGS);
  }
  
  static async getRooms() {
    return await this.#fetchCollection(COLLECTIONS.ROOMS);
  }
  
  static async getCustomers() {
    return await this.#fetchCollection(COLLECTIONS.CUSTOMERS);
  }
  
  static async getTherapists() {
    return await this.#fetchCollection(COLLECTIONS.THERAPISTS);
  }
  
  static async getTherapistDaysOff() {
    return await this.#fetchCollection(COLLECTIONS.THERAPIST_DAYS_OFF);
  }
  
  // ==================== WRITE OPERATIONS ====================
  
  static async saveBooking(bookingData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), bookingData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving booking to Firebase:', error);
      throw error;
    }
  }
  
  static async saveCustomer(customerId, customerData) {
    try {
      await setDoc(doc(db, COLLECTIONS.CUSTOMERS, customerId), customerData);
    } catch (error) {
      console.error('Error saving customer to Firebase:', error);
      throw error;
    }
  }
  
  // ==================== PRIVATE HELPERS ====================
  
  static async #fetchCollection(collectionName) {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error fetching ${collectionName} from Firebase:`, error);
      throw error;
    }
  }
}