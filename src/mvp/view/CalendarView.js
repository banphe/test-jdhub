// CalendarView - wyświetla kalendarz FullCalendar.

import Calendar from './components/calendar.js';
import DetailPanel from './components/detail-panel.js';

export class CalendarView {
    onRendered = null;
    onEventClicked = null;
    
    constructor() {
        this.calendar = new Calendar();
        this.detailPanel = new DetailPanel();
        
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
        
        this.onRendered();
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
}
