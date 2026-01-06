// DetailPanel - panel pokazujący szczegóły rezerwacji.

export default class DetailPanel extends HTMLElement {
    onClose = null;
    
    constructor() {
        super();
        this.rendered = false;
    }
    
    connectedCallback() {
        if (!this.rendered) {
            this.className = 'h-0 overflow-hidden bg-gray-100 border-t';
            this.innerHTML = `
                <button id="close-panel" class="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-xl z-10">&times;</button>
                <div id="panel-content" class="p-3 text-sm"></div>
            `;
            
            this.querySelector('#close-panel').addEventListener('click', () => {
                if (this.onClose) this.onClose();
            });
            
            this.rendered = true;
        }
    }
    
    show(data) {
        this.className = 'relative max-h-44 overflow-y-auto bg-gray-100 border-t';
        
        const statusDot = {
            confirmed: 'bg-green-500',
            pending: 'bg-yellow-500',
            noshow: 'bg-red-500'
        }[data.status] || 'bg-green-500';
        
        const time = data.start && data.end 
            ? `${new Date(data.start).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})} - ${new Date(data.end).toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`
            : '';
        
        const price = data.price - (data.voucherAmount || 0);
        const voucher = data.voucherAmount > 0 ? ` (-${data.voucherAmount})` : '';
        
        // Services: jeden terapeuta inline, wielu jako lista
        const services = data.services || [];
        const servicesHtml = services.length === 1
            ? `<div class="flex items-center gap-1.5 mt-0.5">
                <i class="fa-solid fa-user-nurse text-xs"></i>
                <span>${services[0].therapist}</span>
            </div>`
            : services.map(s => `<div class="flex items-center gap-1.5 mt-0.5 text-xs border-t border-gray-200 pt-1">
                <i class="fa-solid fa-user-nurse"></i>
                <span>${s.treatment} — ${s.therapist}</span>
            </div>`).join('');
        
        this.querySelector('#panel-content').innerHTML = `
            <div class="font-semibold">${data.title}</div>
            <div class="flex items-center gap-1.5 mt-1">
                <span class="w-2 h-2 rounded-full ${statusDot}"></span>
                <i class="fa-solid fa-user text-xs"></i>
                <span>${data.customerName}</span>
            </div>
            ${time ? `<div class="flex items-center gap-1.5 mt-0.5">
                <i class="fa-solid fa-clock text-xs"></i>
                <span>${time}</span>
            </div>` : ''}
            <div class="flex items-center gap-1.5 mt-0.5">
                <i class="fa-solid fa-tag text-xs"></i>
                <span>${price} zł${voucher}</span>
            </div>
            ${servicesHtml}
        `;
    }
    
    hide() {
        this.className = 'h-0 overflow-hidden bg-gray-100 border-t';
    }
}

customElements.define('detail-panel', DetailPanel);
