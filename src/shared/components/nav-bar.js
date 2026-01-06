/**
 * Używane w app.js jako new NavBar().
 * Web Component zawierający wszystkie linki nawigacji.
 * Sam zarządza podświetlaniem aktywnego linku.
 * Flexbox layout: navbar na dole, nie fixed - natural flow.
 * 
 * Opcje (opcjonalne, domyślnie z theme):
 * - bgColor: kolor tła Tailwind
 * - activeColor: kolor aktywnego linku
 * - height: wysokość bara Tailwind
 */
import './nav-link.js';
import { theme } from '../config/theme.js';

export default class NavBar extends HTMLElement {
  
  constructor(options = {}) {
    super();
    this.options = {
      bgColor: options.bgColor || theme.colors.surface,
      activeColor: options.activeColor || theme.colors.textActive,
      height: options.height || theme.spacing.navHeight
    };
  }
  
  connectedCallback() {
    const nav = document.createElement('nav');
    nav.className = `${theme.layout.navFull} ${this.options.bgColor} ${this.options.height} ${theme.layout.navBorder} ${theme.layout.navFlex}`;
    
    const linkCalendar = document.createElement('nav-link');
    linkCalendar.setAttribute('href', '#kalendarz');
    linkCalendar.setAttribute('icon', 'fa-calendar');
    linkCalendar.setAttribute('text', 'Kalendarz');
    linkCalendar.setAttribute('active-color', this.options.activeColor);
    
    const linkReports = document.createElement('nav-link');
    linkReports.setAttribute('href', '#raporty');
    linkReports.setAttribute('icon', 'fa-chart-line');
    linkReports.setAttribute('text', 'Raporty');
    linkReports.setAttribute('active-color', this.options.activeColor);
    
    nav.appendChild(linkCalendar);
    nav.appendChild(linkReports);
    this.appendChild(nav);
    
    // Nasłuchiwanie zmian hash - aktualizacja aktywnego linku
    window.addEventListener('hashchange', () => this.updateActiveLinks());
    this.updateActiveLinks(); // Inicjalne ustawienie
  }
  
  updateActiveLinks() {
    const currentHash = window.location.hash.substring(1);
    const allLinks = this.querySelectorAll('nav-link');
    
    allLinks.forEach(link => {
      const linkHash = link.getHash();
      link.setActive(linkHash === currentHash);
    });
  }
}

customElements.define('nav-bar', NavBar);
