// CalendarPresenter - łączy CalendarService, CalendarAdapter i CalendarView.

export class CalendarPresenter {

    constructor(view, service, adapter, uploadService) {
        this.view = view;
        this.service = service;
        this.adapter = adapter;
        this.uploadService = uploadService;

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

    handleFabClick() {
        this.view.openUploadModal();
    }

    async handleParseRequest(imageDataUrl) {
        this.view.showUploadLoading();

        const result = await this.uploadService.parseScreenshot(imageDataUrl);

        if (result.success) {
            const room = this.rooms.find(r => r.id === result.data.booking.roomId);
            result.data.booking.roomName = room ? room.name : 'Nieznany';
            result.data.warnings = result.warnings;
            this.view.showUploadPreview(result.data);
        } else {
            this.view.showUploadError(result.message);
        }
    }

    async handleSaveRequest(parsedData) {
        try {
            const booking = parsedData.booking;
            const customer = parsedData.customer;

            if (customer.isNew && customer.customerId) {
                await this.service.saveCustomer(customer.customerId, customer.data);
            }

            const bookingToSave = {
                start: booking.start,
                end: booking.end,
                menuItemName: booking.menuItemName,
                services: booking.services,
                price: booking.price,
                voucherAmount: booking.voucherAmount,
                status: booking.status,
                roomId: booking.roomId,
                createdAt: booking.createdAt
            };

            if (customer.customerId) {
                bookingToSave.customerPhone = customer.customerId;
            }

            const bookingId = await this.service.saveBooking(bookingToSave);

            this.view.showUploadSuccess(bookingId);

            this.rooms = null;
            this.bookings = null;
            this.customers = null;
            await this.loadData();
            this.renderCalendar();
        } catch (error) {
            console.error('Error saving booking:', error);
            this.view.showUploadError('Błąd podczas zapisywania rezerwacji');
        }
    }
}
