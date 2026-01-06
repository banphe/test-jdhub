import { generateMockReportData } from '../../../shared/mocks/report-data.js';

/**
 * Service do obsługi danych raportowych.
 * Warstwa abstrakcji - Presenter nie wie SKĄD pochodzą dane (mock/Firestore/API).
 * Obecnie: zwraca mock.
 * Przyszłość: będzie pobierać z Firestore przez Repository.
 */
export default class ReportService {
  
  getReportData() {
    return generateMockReportData();
  }
}
