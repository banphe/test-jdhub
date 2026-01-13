/**
 * Floating Action Button - okrągły przycisk z plusem w prawym dolnym rogu.
 * Emituje event 'fab-clicked' po kliknięciu.
 */
export default class FloatingActionButton extends HTMLElement {

  constructor() {
    super();
    this.rendered = false;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.className = 'fixed bottom-20 right-4 z-50';
      this.innerHTML = `
        <button
          id="fab-button"
          class="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition"
          title="Dodaj rezerwację ze zrzutu Booksy"
        >
          <i class="fas fa-plus text-2xl"></i>
        </button>
      `;

      this.querySelector('#fab-button').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('fab-clicked', { bubbles: true }));
      });

      this.rendered = true;
    }
  }
}

customElements.define('floating-action-button', FloatingActionButton);
