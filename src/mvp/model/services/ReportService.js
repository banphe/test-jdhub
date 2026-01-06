import ReportRepository from '../repositories/ReportRepository.js';

/**
 * Service do obsługi danych raportowych.
 * Warstwa abstrakcji - Presenter nie wie SKĄD pochodzą dane.
 * 
 * Service używa Repository - źródło danych (mock/Firebase) 
 * kontrolowane jest w ReportRepository przez flagę USE_MOCK.
 */
export default class ReportService {
  
  async getReportData() {
    return await ReportRepository.getReportData();
  }
}
