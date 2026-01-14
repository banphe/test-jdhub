/**
 * Modal do uploadu i parsowania zrzutów ekranu z Booksy.
 * Stany: closed, selecting, loading, preview, error
 * Emituje: 'parse-requested', 'save-requested', 'cancel-requested'
 */
export default class UploadModal extends HTMLElement {

  constructor() {
    super();
    this.rendered = false;
    this.currentState = 'closed';
    this.selectedImage = null;
    this.parsedData = null;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
      this.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold">Dodaj rezerwację z Booksy</h2>
              <button id="close-modal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div id="modal-content"></div>
          </div>
        </div>
      `;

      this.querySelector('#close-modal').addEventListener('click', () => {
        this.close();
      });

      this.rendered = true;
    }
  }

  open() {
    this.currentState = 'selecting';
    this.classList.remove('hidden');
    this.renderContent();
  }

  close() {
    this.currentState = 'closed';
    this.classList.add('hidden');
    this.selectedImage = null;
    this.parsedData = null;
    this.dispatchEvent(new CustomEvent('cancel-requested', { bubbles: true }));
  }

  showLoading() {
    this.currentState = 'loading';
    this.renderContent();
  }

  showPreview(data) {
    this.currentState = 'preview';
    this.parsedData = data;
    this.renderContent();
  }

  showError(message) {
    this.currentState = 'error';
    this.errorMessage = message;
    this.renderContent();
  }

  showSuccess(bookingId) {
    this.currentState = 'success';
    this.bookingId = bookingId;
    this.renderContent();
  }

  renderContent() {
    const content = this.querySelector('#modal-content');

    if (this.currentState === 'selecting') {
      content.innerHTML = `
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 mb-4">Wybierz zrzut ekranu z aplikacji Booksy</p>
          <input type="file" id="image-input" accept="image/*" class="hidden">
          <button id="select-image-btn" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
            Wybierz zdjęcie
          </button>
          <div id="preview-container" class="mt-4 hidden">
            <img id="image-preview" class="max-w-full max-h-64 mx-auto rounded border">
            <button id="parse-btn" class="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg">
              Parsuj
            </button>
          </div>
        </div>
      `;

      const input = content.querySelector('#image-input');
      const selectBtn = content.querySelector('#select-image-btn');
      const previewContainer = content.querySelector('#preview-container');
      const imagePreview = content.querySelector('#image-preview');
      const parseBtn = content.querySelector('#parse-btn');

      selectBtn.addEventListener('click', () => input.click());

      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.selectedImage = file;
          const reader = new FileReader();
          reader.onload = (event) => {
            imagePreview.src = event.target.result;
            previewContainer.classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });

      parseBtn.addEventListener('click', () => {
        if (this.selectedImage) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.dispatchEvent(new CustomEvent('parse-requested', {
              detail: { imageDataUrl: event.target.result },
              bubbles: true
            }));
          };
          reader.readAsDataURL(this.selectedImage);
        }
      });
    }

    if (this.currentState === 'loading') {
      content.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-spinner fa-spin text-5xl text-blue-500 mb-4"></i>
          <p class="text-gray-600">Parsowanie zrzutu ekranu...</p>
        </div>
      `;
    }

    if (this.currentState === 'preview') {
      const data = this.parsedData;
      const booking = data.booking;
      const customer = data.customer;

      const startDate = new Date(booking.start);
      const endDate = new Date(booking.end);
      const dateStr = startDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = `${startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;

      const netPrice = booking.price - booking.voucherAmount;
      const voucherHtml = booking.voucherAmount > 0
        ? `<span class="text-sm text-gray-500">(voucher: -${booking.voucherAmount} zł)</span>`
        : '';

      const warningsHtml = data.warnings && data.warnings.length > 0
        ? `<div class="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
            <i class="fas fa-exclamation-triangle text-yellow-600"></i>
            <span class="text-sm text-yellow-800 ml-2">${data.warnings[0].message}</span>
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

      content.innerHTML = `
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
            <span>${dateStr} ${timeStr}</span>
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

      content.querySelector('#cancel-btn').addEventListener('click', () => {
        this.close();
      });

      content.querySelector('#save-btn').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('save-requested', {
          detail: { data: this.parsedData },
          bubbles: true
        }));
      });
    }

    if (this.currentState === 'error') {
      content.innerHTML = `
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <p class="text-red-800 font-semibold mb-2">Błąd parsowania</p>
          <p class="text-red-700 text-sm mb-4">${this.errorMessage}</p>
          <button id="retry-btn" class="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg">
            Spróbuj ponownie
          </button>
        </div>
      `;

      content.querySelector('#retry-btn').addEventListener('click', () => {
        this.currentState = 'selecting';
        this.renderContent();
      });
    }

    if (this.currentState === 'success') {
      content.innerHTML = `
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
          <p class="text-green-800 font-semibold mb-2">Rezerwacja zapisana</p>
          <p class="text-green-700 text-sm mb-4">ID: ${this.bookingId}</p>
          <button id="close-success-btn" class="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg">
            Zamknij
          </button>
        </div>
      `;

      content.querySelector('#close-success-btn').addEventListener('click', () => {
        this.close();
      });
    }
  }
}

customElements.define('upload-modal', UploadModal);
