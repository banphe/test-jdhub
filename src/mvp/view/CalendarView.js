// CalendarView - wyświetla kalendarz FullCalendar.

import Calendar from './components/calendar.js';
import DetailPanel from './components/detail-panel.js';
import FloatingActionButton from './components/floating-action-button.js';
import UploadModal from './components/upload-modal-v2.js';

export class CalendarView {
    onRendered = null;
    onEventClicked = null;
    onFabClicked = null;
    onParseRequested = null;
    onSaveRequested = null;

    constructor() {
        this.calendar = new Calendar();
        this.detailPanel = new DetailPanel();
        this.fab = new FloatingActionButton();
        this.uploadModal = new UploadModal();

        // Calendar emituje → View przekazuje dalej.
        this.calendar.onEventClicked = (event) => {
            if (this.onEventClicked) this.onEventClicked(event);
        };

        // Panel zamknięty → ukryj.
        this.detailPanel.onClose = () => this.hideDetailPanel();
    }
    
    render(container) {
        this.container = container;
        container.innerHTML = '';
        container.style.overflow = '';

        this.container.appendChild(this.calendar);
        this.container.appendChild(this.detailPanel);
        document.body.appendChild(this.fab);
        document.body.appendChild(this.uploadModal);

        this.attachUploadListeners();

        this.onRendered();
    }

    attachUploadListeners() {
        this.fab.addEventListener('fab-clicked', () => {
            if (this.onFabClicked) this.onFabClicked();
        });

        this.uploadModal.addEventListener('parse-requested', (e) => {
            if (this.onParseRequested) this.onParseRequested(e.detail.imageDataUrl);
        });

        this.uploadModal.addEventListener('save-requested', (e) => {
            if (this.onSaveRequested) this.onSaveRequested(e.detail.data);
        });
    }
    
    showCalendar(resources, events) {
        this.calendar.render({ resources, events });
    }
    
    showDetailPanel(data) {
        this.detailPanel.show(data);
        // Poczekaj na animację, potem aktualizuj rozmiar kalendarza.
        setTimeout(() => this.calendar.updateSize(), 300);
    }
    
    hideDetailPanel() {
        this.detailPanel.hide();
        setTimeout(() => this.calendar.updateSize(), 300);
    }
    
    getCurrentDate() {
        return this.calendar.getCurrentDate();
    }
    
    navigateToDate(date) {
        this.calendar.goToDate(date);
    }

    openUploadModal() {
        this.uploadModal.open();
    }

    closeUploadModal() {
        this.uploadModal.close();
    }

    showUploadLoading() {
        this.uploadModal.showLoading();
    }

    showUploadPreview(data) {
        this.uploadModal.showPreview(data);
    }

    showUploadError(message) {
        this.uploadModal.showError(message);
    }

    showUploadSuccess(bookingId) {
        this.uploadModal.showSuccess(bookingId);
    }
}
