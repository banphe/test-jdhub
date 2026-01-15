/**
 * Ekran podglądu sparsowanych danych rezerwacji.
 * Emituje: 'save-requested' z danymi, 'cancel-requested'
 */
export default class UploadModalPreview extends HTMLElement {

  constructor() {
    super();
    this.data = null;
  }

  connectedCallback() {
    this.render();
  }

  setData(data) {
    this.data = data;
    this.render();
  }

  render() {
    if (!this.data) {
      this.innerHTML = /*html*/`<div class="text-center py-12">Brak danych</div>`;
      return;
    }

    const booking = this.data.booking;
    const customer = this.data.customer;

    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);
    const dateStr = startDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = `${startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;

    const netPrice = booking.price - booking.voucherAmount;
    const voucherHtml = booking.voucherAmount > 0
      ? `<span class="text-sm text-gray-500">(voucher: -${booking.voucherAmount} zł)</span>`
      : '';

    const warningsHtml = this.data.warnings && this.data.warnings.length > 0
      ? `<div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <i class="fas fa-exclamation-triangle text-yellow-600"></i>
          <span class="text-sm text-yellow-800 ml-2">${this.data.warnings[0].message}</span>
        </div>`
      : '';

    const customerName = customer.data
      ? `${customer.data.firstName} ${customer.data.lastName}`.trim()
      : 'Szybka rezerwacja';

    const therapistHtml = booking.services.length > 0
      ? `<div class="flex items-center gap-2">
          <i class="fas fa-user-nurse text-gray-500"></i>
          <span>${booking.services.map(s => s.therapist).join(', ')}</span>
        </div>`
      : '';

    this.innerHTML = /*html*/`
      ${warningsHtml}
      <div class="bg-gray-50 rounded-lg p-4 space-y-3">
        <div class="flex items-center gap-2">
          <i class="fas fa-user text-gray-500"></i>
          <span class="font-semibold">${customerName}</span>
          ${customer.isNew ? '<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Nowy klient</span>' : ''}
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-spa text-gray-500"></i>
          <span>${booking.menuItemName}</span>
        </div>
        ${therapistHtml}
        <div class="flex items-center gap-2">
          <i class="fas fa-calendar text-gray-500"></i>
          <span>${dateStr}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-clock text-gray-500"></i>
          <span>${timeStr}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-door-open text-gray-500"></i>
          <span>Pokój: ${booking.roomName}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-tag text-gray-500"></i>
          <span class="font-semibold">${netPrice} zł</span>
          ${voucherHtml}
        </div>
      </div>
      <div class="flex gap-3 mt-6">
        <button id="cancel-btn" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg">
          Anuluj
        </button>
        <button id="save-btn" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
          Zapisz do kalendarza
        </button>
      </div>
    `;

    this.attachListeners();
  }

  attachListeners() {
    const cancelBtn = this.querySelector('#cancel-btn');
    const saveBtn = this.querySelector('#save-btn');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('cancel-requested', { bubbles: true }));
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('save-requested', {
          detail: { data: this.data },
          bubbles: true
        }));
      });
    }
  }
}

customElements.define('upload-modal-preview', UploadModalPreview);
