// DetailPanel - panel pokazujący szczegóły rezerwacji.

export default class DetailPanel extends HTMLElement {
    onClose = null;
    
    constructor() {
        super();
        this.rendered = false;
    }
    
    connectedCallback() {
        if (!this.rendered) {
            this.className = 'h-0 overflow-hidden transition-all duration-300 bg-gray-100 border-t';
            this.innerHTML = `
                <div class="p-4 h-full relative">
                    <button id="close-panel" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
                    <div id="panel-content"></div>
                </div>
            `;
            
            this.querySelector('#close-panel').addEventListener('click', () => {
                if (this.onClose) this.onClose();
            });
            
            this.rendered = true;
        }
    }
    
    show(data) {
        this.className = 'max-h-40 overflow-y-auto bg-gray-100 border-t';
        
        const statusColors = {
            confirmed: 'bg-green-500',
            pending: 'bg-yellow-500',
            noshow: 'bg-red-500'
        };
        const statusColor = statusColors[data.status] || statusColors.confirmed;
        
        const startTime = data.start ? new Date(data.start).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '';
        const endTime = data.end ? new Date(data.end).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '';
        const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : '';
        
        const addonsHtml = data.addons && data.addons.length > 0
            ? `
            <div class="flex items-center gap-2 text-gray-700">
                <i class="fa-solid fa-plus"></i>
                <span>${data.addons.map(a => `${a.name} (${a.price} zł)`).join(', ')}</span>
            </div>`
            : '';
        
        const voucherInfo = data.voucherAmount > 0
            ? ` (voucher -${data.voucherAmount} zł)`
            : '';
        
        const finalPrice = data.price - (data.voucherAmount || 0);
        
        let servicesHtml = '';
        if (data.services && data.services.length > 1) {
            servicesHtml = data.services.map(s => `
                <div class="border-t border-gray-200 pt-2 mt-2">
                    <div class="text-sm font-semibold text-gray-600">${s.treatment}</div>
                    <div class="flex items-center gap-2 text-gray-700 text-sm">
                        <i class="fa-solid fa-user-nurse"></i>
                        <span>${s.therapist}</span>
                    </div>
                </div>
            `).join('');
        } else if (data.services && data.services.length === 1) {
            servicesHtml = `
                <div class="flex items-center gap-2 text-gray-700">
                    <i class="fa-solid fa-user-nurse"></i>
                    <span>${data.services[0].therapist}</span>
                </div>
            `;
        }
        
        this.querySelector('#panel-content').innerHTML = `
            <div class="space-y-1">
                <div class="text-base font-semibold">${data.title}</div>
                <div class="flex items-center gap-2 text-gray-700">
                    <span class="w-2 h-2 rounded-full ${statusColor} inline-block"></span>
                    <i class="fa-solid fa-user"></i>
                    <span>${data.customerName}</span>
                </div>
                ${timeRange ? `<div class="flex items-center gap-2 text-gray-700">
                    <i class="fa-solid fa-clock"></i>
                    <span>${timeRange}</span>
                </div>` : ''}
                <div class="flex items-center gap-2 text-gray-700">
                    <i class="fa-solid fa-tag"></i>
                    <span>${finalPrice} zł${voucherInfo}</span>
                </div>
                ${addonsHtml}
                ${servicesHtml}
            </div>
        `;
    }
    
    hide() {
        this.className = 'h-0 overflow-hidden bg-gray-100 border-t';
    }
}

customElements.define('detail-panel', DetailPanel);
