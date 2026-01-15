/**
 * Ekran ładowania podczas parsowania zrzutu ekranu.
 */
export default class UploadModalLoading extends HTMLElement {

  connectedCallback() {
    this.innerHTML = /*html*/`
      <div class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-5xl text-blue-500 mb-4"></i>
        <p class="text-gray-600">Parsowanie zrzutu ekranu...</p>
      </div>
    `;
  }
}

customElements.define('upload-modal-loading', UploadModalLoading);
