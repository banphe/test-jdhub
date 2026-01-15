/**
 * Ekran potwierdzenia zapisu rezerwacji.
 * Emituje: 'close-requested'
 */
export default class UploadModalSuccess extends HTMLElement {

  constructor() {
    super();
    this.bookingId = '';
  }

  connectedCallback() {
    this.render();
  }

  setBookingId(id) {
    this.bookingId = id;
    this.render();
  }

  render() {
    this.innerHTML = /*html*/`
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <i class="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
        <p class="text-green-800 font-semibold mb-2">Rezerwacja zapisana</p>
        <p class="text-green-700 text-sm mb-4">ID: ${this.bookingId}</p>
        <button id="close-success-btn" class="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg">
          Zamknij
        </button>
      </div>
    `;

    this.attachListeners();
  }

  attachListeners() {
    const closeBtn = this.querySelector('#close-success-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('close-requested', { bubbles: true }));
      });
    }
  }
}

customElements.define('upload-modal-success', UploadModalSuccess);
