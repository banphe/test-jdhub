/**
 * Używane w app.js jako new AppContainer().
 * Web Component - główny kontener dla widoków aplikacji.
 * Flexbox layout: zajmuje całą dostępną przestrzeń między body a navbarem.
 * 
 * Opcje (opcjonalne, domyślnie z theme):
 * - padding: padding Tailwind
 */
import { theme } from '../config/theme.js';

export default class AppContainer extends HTMLElement {
  
  constructor(options = {}) {
    super();
    this.id = 'app-container';
    
    const padding = options.padding || theme.spacing.containerPadding;
    
    // Flex column dla RaportyView, overflow-y-auto dla scroll, min-h-0 dla flex children
    this.className = `${padding} flex-1 flex flex-col min-h-0 overflow-y-auto`;
  }
}

customElements.define('app-container', AppContainer);
