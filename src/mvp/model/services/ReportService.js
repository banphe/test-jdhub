import ReportRepository from '../repositories/ReportRepository.js';
import TherapistRepository from '../repositories/TherapistRepository.js';
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
    const [bookings, therapists, therapistDaysOff] = await Promise.all([
      ReportRepository.getBookings(),
      TherapistRepository.getAll(),
      TherapistRepository.getAllDaysOff()
    ]);
    return this.adapter.aggregateToMonthly(bookings, therapists, therapistDaysOff);
  }
}
