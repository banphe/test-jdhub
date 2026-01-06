import ReportToolbar from './components/report-toolbar.js';
import ReportChart from './components/report-chart.js';

export default class ReportView {
  onRendered = null;

  constructor() {
    this.toolbar = new ReportToolbar({ className: 'shrink-0' });
    this.chart = new ReportChart();
  }

  render(container) {
    this.container = container;
    container.innerHTML = '';
    container.style.overflow = 'hidden';
    
    this.container.appendChild(this.toolbar);
    this.container.appendChild(this.chart);

    this.onRendered();
  }

  // === METODY WYWOŁYWANE PRZEZ PRESENTER ===

  setupToolbar(months, currentMonthKey) {
    this.toolbar.setMonths(months, currentMonthKey);
  }

  showChart(data, formatter) {
    this.chart.render({ data, formatter });
  }
}
