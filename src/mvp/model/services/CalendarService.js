import DataRepository from '../repositories/DataRepository.js';

/**
 * Service do obsługi danych kalendarza.
 * Warstwa abstrakcji - Presenter nie wie SKĄD pochodzą dane.
 */
export class CalendarService {

    async getRooms() {
        return await DataRepository.getRooms();
    }

    async getCustomers() {
        return await DataRepository.getCustomers();
    }

    async getBookings() {
        return await DataRepository.getBookings();
    }

    async saveBooking(bookingData) {
        return await DataRepository.saveBooking(bookingData);
    }

    async saveCustomer(customerId, customerData) {
        return await DataRepository.saveCustomer(customerId, customerData);
    }
}
