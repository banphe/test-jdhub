/**
 * Używane w NavBar jako nav-link.
 * Custom Element (Web Component) do nawigacji hash-based routing.
 * NavBar wywołuje setActive() żeby podświetlić aktywny link.
 */
import { theme } from '../config/theme.js';

const BASE_CLASSES = 'flex flex-col items-center px-4 py-2 min-w-[70px] transition hover:bg-gray-100';

class NavLink extends HTMLElement {
  
  connectedCallback() {
    const href = this.getAttribute('href');
    const icon = this.getAttribute('icon');
    const text = this.getAttribute('text');
    this.activeColor = this.getAttribute('active-color') || theme.colors.textActive;
    
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.className = `${BASE_CLASSES} ${theme.colors.textInactive}`;
    
    const iconElement = document.createElement('i');
    iconElement.className = `fa-solid ${icon} ${theme.text.iconSize}`;
    
    const textElement = document.createElement('span');
    textElement.className = `${theme.text.small} mt-1`;
    textElement.textContent = text;
    
    anchor.appendChild(iconElement);
    anchor.appendChild(textElement);
    this.appendChild(anchor);
  }
  
  setActive(isActive) {
    const anchor = this.querySelector('a');
    anchor.classList.toggle(this.activeColor, isActive);
    anchor.classList.toggle(theme.colors.textInactive, !isActive);
  }

  getHash() {
    return this.getAttribute('href').substring(1);
  }
}

customElements.define('nav-link', NavLink);
