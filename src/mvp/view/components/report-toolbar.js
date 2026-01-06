/**
 * Górny toolbar w widoku raportów.
 * Emituje eventy: mode-change, month-change, metric-change.
 * Sterowany z zewnątrz przez setMonths(), setMode(), setMetric().
 */
import { theme } from '../../../shared/config/theme.js';

const METRICS = [
  { id: 'revenue', icon: 'fa-coins', title: 'Przychód' },
  { id: 'utilization', icon: 'fa-clock', title: 'Obłożenie' },
  { id: 'hours', icon: 'fa-hourglass-half', title: 'Godziny' },
  { id: 'zlh', icon: 'fa-chart-line', title: 'zł/h' }
];

export default class ReportToolbar extends HTMLElement {
  constructor(options = {}) {
    super();
    this.currentMode = 'daily';
    this.currentMetric = 'revenue';
    this.rendered = false;
    
    if (options.className) this.className = options.className;
  }

  connectedCallback() {
    this.style.display = 'block';
    
    // Renderuj tylko raz.
    if (!this.rendered) {
      this.render();
      this.attachListeners();
      this.rendered = true;
    }
  }

  render() {
    const t = theme.toolbar;
    
    const btnBase = `${t.buttonSize} ${t.buttonText} ${t.buttonRounded} transition`;
    
    this.innerHTML = `
      <div class="${t.container} ${t.containerPadding}">
        <div class="${t.divider} ${t.dividerSpacing}">
          <button id="view-toggle" class="${btnBase} ${t.buttonInactive} ${t.buttonHover} font-bold" title="Przełącz widok">D</button>
        </div>
        <div id="month-section" class="${t.divider} ${t.dividerSpacing}">
          <select id="month-select" class="${t.selectSize} ${t.selectStyle}"></select>
        </div>
        <div class="${t.metricsContainer} ${t.metricsGap}">
          ${METRICS.map(m => `
            <button data-metric="${m.id}" class="metric-btn ${btnBase}" title="${m.title}">
              <i class="fas ${m.icon}"></i>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    
    this.updateMetricButtons();
  }

  attachListeners() {
    // Toggle D/M
    this.querySelector('#view-toggle').addEventListener('click', () => {
      this.currentMode = this.currentMode === 'daily' ? 'monthly' : 'daily';
      this.updateModeToggle();
      this.emit('mode-change', { mode: this.currentMode });
    });

    // Select miesiąca
    this.querySelector('#month-select').addEventListener('change', (e) => {
      this.emit('month-change', { monthKey: e.target.value });
    });

    // Przyciski metryk
    this.querySelectorAll('.metric-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentMetric = btn.dataset.metric;
        this.updateMetricButtons();
        this.emit('metric-change', { metric: this.currentMetric });
      });
    });
  }

  updateModeToggle() {
    const btn = this.querySelector('#view-toggle');
    btn.textContent = this.currentMode === 'daily' ? 'D' : 'M';
    
    const monthSection = this.querySelector('#month-section');
    monthSection.style.display = this.currentMode === 'daily' ? 'flex' : 'none';
  }

  updateMetricButtons() {
    const t = theme.toolbar;
    const btnBase = `${t.buttonSize} ${t.buttonText} ${t.buttonRounded} transition`;
    
    this.querySelectorAll('.metric-btn').forEach(btn => {
      const isActive = btn.dataset.metric === this.currentMetric;
      btn.className = `metric-btn ${btnBase} ${isActive ? t.buttonActive : `${t.buttonInactive} ${t.buttonHover}`}`;
    });
  }

  /**
   * Emituje CustomEvent.
   */
  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
  }

  // === API publiczne ===

  /**
   * Ustawia listę miesięcy w select.
   * @param {Array} months - [{key: '2025-01', label: 'Styczeń 2025'}, ...]
   * @param {string} selected - klucz wybranego miesiąca
   */
  setMonths(months, selected) {
    const select = this.querySelector('#month-select');
    select.innerHTML = months.map(m => 
      `<option value="${m.key}">${m.label}</option>`
    ).join('');
    select.value = selected;
  }

  /**
   * Ustawia tryb widoku.
   */
  setMode(mode) {
    this.currentMode = mode;
    this.updateModeToggle();
  }

  /**
   * Ustawia aktywną metrykę.
   */
  setMetric(metric) {
    this.currentMetric = metric;
    this.updateMetricButtons();
  }
}

customElements.define('report-toolbar', ReportToolbar);
