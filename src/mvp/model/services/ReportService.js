import ReportRepository from '../repositories/ReportRepository.js';
import ReportAdapter from '../adapters/ReportAdapter.js';

/**
 * Service do obsługi danych raportowych.
 * Orkiestruje pobieranie danych (Repository) i transformację (Adapter).
 * 
 * Przepływ: Repository (surowe bookings) → Adapter (agregacja) → Presenter
 */
export default class ReportService {
  
  constructor() {
    this.adapter = new ReportAdapter();
  }
  
  async getReportData() {
    const bookings = await ReportRepository.getBookings();
    return this.adapter.aggregateToMonthly(bookings);
  }
}
