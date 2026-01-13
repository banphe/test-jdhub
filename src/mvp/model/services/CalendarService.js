import CalendarRepository from '../repositories/CalendarRepository.js';

/**
 * Service do obsługi danych kalendarza.
 * Warstwa abstrakcji - Presenter nie wie SKĄD pochodzą dane.
 * 
 * Service używa Repository - źródło danych (mock/Firebase) 
 * kontrolowane jest w CalendarRepository przez flagę USE_MOCK.
 */
export class CalendarService {

    async getRooms() {
        return await CalendarRepository.getRooms();
    }

    async getCustomers() {
        return await CalendarRepository.getCustomers();
    }

    async getBookings() {
        return await CalendarRepository.getBookings();
    }

    async saveBooking(bookingData) {
        return await CalendarRepository.saveBooking(bookingData);
    }

    async saveCustomer(customerId, customerData) {
        return await CalendarRepository.saveCustomer(customerId, customerData);
    }
}
