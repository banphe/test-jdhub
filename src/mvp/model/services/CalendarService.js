// CalendarService - dostarcza surowe dane rezerwacji, klientów i pokoi.

export class CalendarService {
    
    getRooms() {
        return [
            { id: 'room-1', name: 'Duży' },
            { id: 'room-2', name: 'Mały' }
        ];
    }
    
    getCustomers() {
        return [
            { id: 'customer-1', firstName: 'Anna', lastName: 'Kowalska' },
            { id: 'customer-2', firstName: 'Jan', lastName: 'Nowak' },
            { id: 'customer-3', firstName: 'Maria i Piotr', lastName: '' }
        ];
    }
    
    getBookings() {
        const today = new Date().toISOString().split('T')[0];
        
        return [
            {
                id: 'booking-1',
                roomId: 'room-1',
                customerId: 'customer-1',
                start: `${today}T10:00:00`,
                end: `${today}T11:30:00`,
                menuItemName: 'Tradycyjny masaż tajski',
                price: 200,
                addons: [],
                voucherAmount: 0,
                services: [{ treatment: 'Tradycyjny masaż tajski', therapist: 'Daisy' }],
                status: 'confirmed',
                externalId: 'BOOKSY-101'
            },
            {
                id: 'booking-2',
                roomId: 'room-1',
                customerId: 'customer-2',
                start: `${today}T14:00:00`,
                end: `${today}T15:00:00`,
                menuItemName: 'Tajski masaż stóp i ramion',
                price: 120,
                addons: [],
                voucherAmount: 0,
                services: [{ treatment: 'Tajski masaż stóp i ramion', therapist: 'Rose' }],
                status: 'confirmed',
                externalId: 'BOOKSY-102'
            },
            {
                id: 'booking-3',
                roomId: 'room-2',
                customerId: 'customer-3',
                start: `${today}T12:00:00`,
                end: `${today}T14:00:00`,
                menuItemName: 'Masaż dla dwojga',
                price: 400,
                addons: [],
                voucherAmount: 0,
                services: [
                    { treatment: 'Klasyczny masaż tajski', therapist: 'Daisy' },
                    { treatment: 'Klasyczny masaż tajski', therapist: 'Rose' }
                ],
                status: 'confirmed',
                externalId: 'BOOKSY-103'
            }
        ];
    }
}
