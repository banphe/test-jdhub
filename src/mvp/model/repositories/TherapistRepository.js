import { db } from '../../config/firebase-init.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

/**
 * Repository dla danych terapeutów i ich dni wolnych.
 * Używane przez ReportService do obliczania hoursAvailable.
 */
export default class TherapistRepository {
  
  static USE_MOCK = false;
  
  /**
   * Pobiera wszystkich terapeutów.
   */
  static async getAll() {
    if (this.USE_MOCK) {
      return this.#getMockTherapists();
    } else {
      return await this.#getFromFirebase();
    }
  }
  
  static async #getFromFirebase() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.THERAPISTS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching therapists from Firebase:', error);
      throw error;
    }
  }
  
  static #getMockTherapists() {
    return [
      { id: '1', name: 'Terapeuta 1', hoursPerDay: 13 }
    ];
  }
}
