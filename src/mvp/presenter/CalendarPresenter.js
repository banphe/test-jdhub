// CalendarPresenter - łączy CalendarService, CalendarAdapter i CalendarView.

export class CalendarPresenter {
    
    constructor(view, service, adapter) {
        this.view = view;
        this.service = service;
        this.adapter = adapter;
        
        this.rooms = null;
        this.customers = null;
        this.bookings = null;
    }
    
    // Wywoływane przez View po zamontowaniu.
    async init() {
        await this.loadData();
        this.renderCalendar();
    }
    
    async loadData() {
        if (this.rooms) return; // Już załadowane.
        
        this.rooms = await this.service.getRooms();
        this.customers = await this.service.getCustomers();
        this.bookings = await this.service.getBookings();
    }
    
    renderCalendar() {
        const resources = this.adapter.toResources(this.rooms);
        const events = this.adapter.toEvents(this.bookings, this.customers);
        
        this.view.showCalendar(resources, events);
    }
    
    handleEventClick(event) {
        const data = {
            id: event.id,
            title: event.title,
            customerName: event.extendedProps.customerName,
            start: event.start,
            end: event.end,
            price: event.extendedProps.price,
            voucherAmount: event.extendedProps.voucherAmount,
            addons: event.extendedProps.addons,
            services: event.extendedProps.services,
            status: event.extendedProps.status
        };
        this.view.showDetailPanel(data);
    }
}
