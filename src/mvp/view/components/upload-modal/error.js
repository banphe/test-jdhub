/**
 * Ekran błędu parsowania.
 * Emituje: 'retry-requested'
 */
export default class UploadModalError extends HTMLElement {

  constructor() {
    super();
    this.errorMessage = 'Nieznany błąd';
  }

  connectedCallback() {
    this.render();
  }

  setMessage(message) {
    this.errorMessage = message;
    this.render();
  }

  render() {
    this.innerHTML = /*html*/`
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
        <p class="text-red-800 font-semibold mb-2">Błąd parsowania</p>
        <p class="text-red-700 text-sm mb-4">${this.errorMessage}</p>
        <button id="retry-btn" class="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg">
          Spróbuj ponownie
        </button>
      </div>
    `;

    this.attachListeners();
  }

  attachListeners() {
    const retryBtn = this.querySelector('#retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('retry-requested', { bubbles: true }));
      });
    }
  }
}

customElements.define('upload-modal-error', UploadModalError);
