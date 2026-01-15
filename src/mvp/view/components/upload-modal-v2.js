/**
 * Modal do uploadu i parsowania zrzutów ekranu z Booksy - v2.
 * Orkiestruje podkomponenty zamiast zarządzać wszystkimi stanami wewnętrznie.
 * 
 * Stany: closed, selecting, loading, preview, error, success
 * Emituje: 'parse-requested', 'save-requested', 'cancel-requested'
 */
import './upload-modal/selecting.js';
import './upload-modal/loading.js';
import './upload-modal/preview.js';
import './upload-modal/error.js';
import './upload-modal/success.js';

export default class UploadModalV2 extends HTMLElement {

  constructor() {
    super();
    this.rendered = false;
    this.currentState = 'closed';
  }

  connectedCallback() {
    if (!this.rendered) {
      this.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
      this.innerHTML = /*html*/`
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

      this.attachInternalHandlers();
      this.rendered = true;
    }
  }

  attachInternalHandlers() {
    this.addEventListener('cancel-requested', (e) => {
      if (e.target !== this) {
        e.stopPropagation();
        this.close();
      }
    });

    this.addEventListener('retry-requested', (e) => {
      if (e.target !== this) {
        e.stopPropagation();
        this.currentState = 'selecting';
        this.renderContent();
      }
    });

    this.addEventListener('close-requested', (e) => {
      if (e.target !== this) {
        e.stopPropagation();
        this.close();
      }
    });
  }

  open() {
    this.currentState = 'selecting';
    this.classList.remove('hidden');
    this.renderContent();
  }

  close() {
    this.currentState = 'closed';
    this.classList.add('hidden');
    this.dispatchEvent(new CustomEvent('cancel-requested', { bubbles: true }));
  }

  showLoading() {
    this.currentState = 'loading';
    this.renderContent();
  }

  showPreview(data) {
    this.currentState = 'preview';
    this.renderContent();
    
    const previewComponent = this.querySelector('upload-modal-preview');
    if (previewComponent) {
      previewComponent.setData(data);
    }
  }

  showError(message) {
    this.currentState = 'error';
    this.renderContent();
    
    const errorComponent = this.querySelector('upload-modal-error');
    if (errorComponent) {
      errorComponent.setMessage(message);
    }
  }

  showSuccess(bookingId) {
    this.currentState = 'success';
    this.renderContent();
    
    const successComponent = this.querySelector('upload-modal-success');
    if (successComponent) {
      successComponent.setBookingId(bookingId);
    }
  }

  renderContent() {
    const content = this.querySelector('#modal-content');

    if (this.currentState === 'selecting') {
      content.innerHTML = '<upload-modal-selecting></upload-modal-selecting>';
    }

    if (this.currentState === 'loading') {
      content.innerHTML = '<upload-modal-loading></upload-modal-loading>';
    }

    if (this.currentState === 'preview') {
      content.innerHTML = '<upload-modal-preview></upload-modal-preview>';
    }

    if (this.currentState === 'error') {
      content.innerHTML = '<upload-modal-error></upload-modal-error>';
    }

    if (this.currentState === 'success') {
      content.innerHTML = '<upload-modal-success></upload-modal-success>';
    }
  }
}

customElements.define('upload-modal-v2', UploadModalV2);
