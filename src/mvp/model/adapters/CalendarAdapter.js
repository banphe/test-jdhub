// CalendarAdapter - konwertuje dane do formatu FullCalendar.

const ROOM_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'];

export class CalendarAdapter {
    
    // Konwertuje pokój na zasób FullCalendar.
    toResource(room, index) {
        return {
            id: room.id,
            title: room.name,
            eventBackgroundColor: ROOM_COLORS[index % ROOM_COLORS.length]
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
        
        let backgroundColor = '';
        if (booking.status === 'noshow') {
            backgroundColor = '#95a5a6';
        }
        
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
