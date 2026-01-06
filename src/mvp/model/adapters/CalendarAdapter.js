// CalendarAdapter - konwertuje dane do formatu FullCalendar.

const MASSAGE_COLORS = {
    'Klasyczny masaż tajski': '#3498db',
    'Masaż dla dwojga': '#9b59b6',
    'Masaż gorącym olejkiem': '#e67e22',
    'Masaż gorącymi kamieniami': '#e74c3c',
    'Masaż olejkami aromatycznymi': '#1abc9c',
    'Masaż pleców - Zdrowy kręgosłup': '#2ecc71',
    'Masaż stemplami ziołowymi': '#f39c12',
    'Tajski masaż olejkiem': '#16a085',
    'Tajski masaż stóp i ramion': '#2980b9',
    'Thairapy Deep Relax - masaż autorski': '#8e44ad',
    'Tradycyjny masaż tajski': '#34495e'
};

const DEFAULT_COLOR = '#95a5a6';
const NOSHOW_COLOR = '#bdc3c7';

export class CalendarAdapter {
    
    // Konwertuje pokój na zasób FullCalendar.
    toResource(room, index) {
        return {
            id: room.id,
            title: room.name
        };
    }
    
    // Konwertuje rezerwację na event FullCalendar.
    toEvent(booking, customers) {
        const customer = booking.customerId
            ? customers.find(c => c.id === booking.customerId)
            : null;
        
        const customerName = customer
            ? `${customer.firstName} ${customer.lastName}`.trim()
            : 'Szybka rezerwacja';
        
        const backgroundColor = booking.status === 'noshow'
            ? NOSHOW_COLOR
            : (MASSAGE_COLORS[booking.menuItemName] || DEFAULT_COLOR);
        
        return {
            id: booking.id,
            resourceId: booking.roomId,
            start: booking.start,
            end: booking.end,
            title: `${booking.menuItemName} [${booking.externalId || 'BRAK'}]`,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            extendedProps: {
                customerName: customerName,
                price: booking.price,
                voucherAmount: booking.voucherAmount || 0,
                addons: booking.addons || [],
                services: booking.services || [],
                status: booking.status
            }
        };
    }
    
    // Batch: wszystkie pokoje.
    toResources(rooms) {
        return rooms.map((room, index) => this.toResource(room, index));
    }
    
    // Batch: wszystkie rezerwacje.
    toEvents(bookings, customers) {
        return bookings
            .filter(b => b.status !== 'cancelled')
            .map(booking => this.toEvent(booking, customers));
    }
}
