import { db } from '../../config/firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { COLLECTIONS } from '../../config/constants.js';
import { generateMockReportData } from '../../../shared/mocks/report-data.js';

/**
 * Repository dla danych raportowych.
 * Odpowiada za źródło danych - mock lub Firebase.
 * 
 * Przełącznik USE_MOCK kontroluje skąd pochodzą dane:
 * - true: zwraca dane z mocka (development)
 * - false: pobiera z Firebase Firestore (production)
 */
export default class ReportRepository {
  
  static USE_MOCK = false; // ← Przełącznik mock/Firebase
  
  /**
   * Zwraca dane raportowe.
   * Format zwracany jest zawsze ten sam niezależnie od źródła.
   */
  static async getReportData() {
    if (this.USE_MOCK) {
      return this.#getFromMock();
    } else {
      return await this.#getFromFirebase();
    }
  }
  
  /**
   * Pobiera dane z mocka (szybkie, bez sieci).
   */
  static #getFromMock() {
    return generateMockReportData();
  }
  
  /**
   * Pobiera dane z Firebase Firestore.
   * 
   * Zakłada że w Firestore istnieją kolekcje:
   * - bookings (rezerwacje z cenami i datami)
   * - therapists (masażystki z godzinami pracy)
   * 
   * TODO: Po stronie backendu trzeba będzie agregować te dane do formatu
   * identycznego jak mock (miesięczne podsumowania z utilization).
   */
  static async #getFromFirebase() {
    try {
      // Pobierz wszystkie rezerwacje
      const bookingsSnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
      const bookings = bookingsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Pobierz masażystki (do obliczania utilization)
      const therapistsSnapshot = await getDocs(collection(db, COLLECTIONS.THERAPISTS));
      const therapists = therapistsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // TODO: Implementacja agregacji danych na format miesięczny
      // Na razie zwracam pusty obiekt - trzeba będzie zaimplementować
      // logikę agregacji identyczną jak w starej wersji (ReportAggregator)
      console.warn('ReportRepository.#getFromFirebase() - not implemented yet');
      return [];
      
    } catch (error) {
      console.error('Error fetching report data from Firebase:', error);
      throw error;
    }
  }
}
