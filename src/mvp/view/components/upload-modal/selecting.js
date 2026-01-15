/**
 * Ekran wyboru pliku zrzutu ekranu z Booksy.
 * Emituje: 'parse-requested' z imageDataUrl po kliknięciu "Parsuj"
 */
export default class UploadModalSelecting extends HTMLElement {

  constructor() {
    super();
    this.selectedImage = null;
  }

  connectedCallback() {
    this.innerHTML = /*html*/`
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div id="initial-upload">
          <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 mb-4">Wybierz zrzut ekranu z aplikacji Booksy</p>
          <input type="file" id="image-input" accept="image/*" class="hidden">
          <button id="select-image-btn" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
            Wybierz zdjęcie
          </button>
        </div>
        <div id="preview-container" class="hidden">
          <img id="image-preview" class="max-w-full mx-auto rounded border mb-4">
          <div class="flex gap-3 justify-center">
            <button id="cancel-selection-btn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-lg">
              Anuluj
            </button>
            <button id="parse-btn" class="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg">
              Parsuj
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachListeners();
  }

  attachListeners() {
    const input = this.querySelector('#image-input');
    const selectBtn = this.querySelector('#select-image-btn');
    const initialUpload = this.querySelector('#initial-upload');
    const previewContainer = this.querySelector('#preview-container');
    const imagePreview = this.querySelector('#image-preview');
    const cancelSelectionBtn = this.querySelector('#cancel-selection-btn');
    const parseBtn = this.querySelector('#parse-btn');

    selectBtn.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.selectedImage = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          imagePreview.src = event.target.result;
          initialUpload.classList.add('hidden');
          previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    cancelSelectionBtn.addEventListener('click', () => {
      this.selectedImage = null;
      input.value = '';
      initialUpload.classList.remove('hidden');
      previewContainer.classList.add('hidden');
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
}

customElements.define('upload-modal-selecting', UploadModalSelecting);
