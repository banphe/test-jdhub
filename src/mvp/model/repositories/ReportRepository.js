import { db } from '../../config/firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { COLLECTIONS } from '../../config/constants.js';
import { generateMockReportBookings } from '../../../shared/mocks/report-data.js';

/**
 * Repository dla danych raportowych.
 * Odpowiada za źródło danych - mock lub Firebase.
 * 
 * Przełącznik USE_MOCK kontroluje skąd pochodzą dane:
 * - true: zwraca bookings z mocka (development)
 * - false: pobiera bookings z Firebase Firestore (production)
 * 
 * Zwraca SUROWE bookings - agregacja jest odpowiedzialnością Adaptera.
 */
export default class ReportRepository {
  
  static USE_MOCK = false; // ← Przełącznik mock/Firebase
  
  /**
   * Zwraca surowe rezerwacje (bookings).
   * Format zwracany jest zawsze ten sam niezależnie od źródła.
   */
  static async getBookings() {
    if (this.USE_MOCK) {
      return generateMockReportBookings();
    } else {
      return await this.#getBookingsFromFirebase();
    }
  }
  
  /**
   * Pobiera bookings z Firebase Firestore.
   */
  static async #getBookingsFromFirebase() {
    try {
      const bookingsSnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
      return bookingsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error fetching bookings from Firebase:', error);
      throw error;
    }
  }
}
