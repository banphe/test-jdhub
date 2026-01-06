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
   * Pobiera dane z Firebase Firestore i agreguje do formatu raportowego.
   */
  static async #getFromFirebase() {
    try {
      const bookingsSnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
      const bookings = bookingsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Grupuj rezerwacje po miesiącach YYYY-MM
      const monthsMap = {};
      
      bookings.forEach(booking => {
        if (!booking.start) return;
        
        const date = new Date(booking.start);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const day = date.getDate();
        
        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = {
            key: monthKey,
            monthName: date.toLocaleDateString('pl-PL', { month: 'long' }),
            year: date.getFullYear(),
            days: {},
            totalNet: 0,
            totalCount: 0,
            utilization: { hoursWorked: 0, hoursAvailable: 0, percentage: 0 }
          };
        }
        
        if (!monthsMap[monthKey].days[day]) {
          monthsMap[monthKey].days[day] = {
            day,
            net: 0,
            count: 0,
            utilization: { hoursWorked: 0, hoursAvailable: 30, percentage: 0 }
          };
        }
        
        const dayData = monthsMap[monthKey].days[day];
        const duration = booking.duration || 60;
        const hours = duration / 60;
        
        dayData.net += booking.price || 0;
        dayData.count += 1;
        dayData.utilization.hoursWorked += hours;
        dayData.utilization.percentage = Math.round(
          (dayData.utilization.hoursWorked / dayData.utilization.hoursAvailable) * 100
        );
        
        monthsMap[monthKey].totalNet += booking.price || 0;
        monthsMap[monthKey].totalCount += 1;
        monthsMap[monthKey].utilization.hoursWorked += hours;
      });
      
      // Oblicz percentage dla miesięcy
      Object.values(monthsMap).forEach(month => {
        const daysCount = Object.keys(month.days).length;
        month.utilization.hoursAvailable = daysCount * 30;
        month.utilization.percentage = Math.round(
          (month.utilization.hoursWorked / month.utilization.hoursAvailable) * 100
        );
      });
      
      // Zwróć tablicę posortowaną chronologicznie
      return Object.values(monthsMap).sort((a, b) => a.key.localeCompare(b.key));
      
    } catch (error) {
      console.error('Error fetching report data from Firebase:', error);
      throw error;
    }
  }
}
