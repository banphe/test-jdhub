// Calendar - Web Component wyświetlający FullCalendar.

const CALENDAR_CONFIG = {
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialView: 'resourceTimeGridDay',
    locale: 'pl',
    allDaySlot: false,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
    },
    titleFormat: { day: '2-digit', month: '2-digit', year: '2-digit' },
    slotMinTime: '10:00:00',
    slotMaxTime: '23:00:00',
    slotDuration: '00:30:00',
    height: '100%'
};

export default class Calendar extends HTMLElement {
    onEventClicked = null;
    
    constructor() {
        super();
        this.calendar = null;
        this.rendered = false;
    }
    
    connectedCallback() {
        // Renderuj tylko raz.
        if (!this.rendered) {
            this.className = 'flex-1 min-h-0';
            this.innerHTML = '<div id="calendar-container" class="h-full"></div>';
            this.rendered = true;
        }
    }
    
    render({ resources, events }) {
        const container = this.querySelector('#calendar-container');
        
        // Destroy previous instance if exists.
        if (this.calendar) {
            this.calendar.destroy();
        }
        
        this.calendar = new FullCalendar.Calendar(container, {
            ...CALENDAR_CONFIG,
            resources,
            events,
            eventClick: (info) => {
                if (this.onEventClicked) {
                    this.onEventClicked(info.event);
                }
            }
        });
        
        this.calendar.render();
    }
    
    updateSize() {
        if (this.calendar) {
            this.calendar.updateSize();
        }
    }
    
    goToDate(date) {
        if (this.calendar) {
            this.calendar.gotoDate(date);
        }
    }
    
    getCurrentDate() {
        if (this.calendar) {
            return this.calendar.getDate();
        }
        return new Date();
    }
}

customElements.define('app-calendar', Calendar);
