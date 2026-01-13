/**
 * Service do parsowania zrzutów ekranu z Booksy.
 * Wywołuje Cloud Function parseBooksy i zwraca sparsowane dane.
 */
export default class BookingUploadService {

  constructor() {
    this.apiUrl = 'https://us-central1-thairapy.cloudfunctions.net/parseBooksy';
  }

  /**
   * Parsuje zrzut ekranu z Booksy.
   * @param {string} imageDataUrl - Obraz zakodowany jako data URL (base64)
   * @returns {Promise<Object>} - { success: true, data: {...} } lub { success: false, error: '...', message: '...' }
   */
  async parseScreenshot(imageDataUrl) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageDataUrl })
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'UNKNOWN_ERROR',
          message: result.message || 'Nieznany błąd'
        };
      }

      return result;
    } catch (error) {
      console.error('Error calling parseBooksy:', error);
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Błąd połączenia z serwerem'
      };
    }
  }
}
