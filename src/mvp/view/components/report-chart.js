/**
 * Komponent wykresu raportowego oparty na ApexCharts.
 * Enkapsuluje domyślną konfigurację - wystarczy podać dane.
 */
export default class ReportChart extends HTMLElement {
  constructor() {
    super();
    this.chart = null;
    this.rendered = false;
    
    // Domyślna konfiguracja (to co zawsze powtarzamy)
    this.defaults = {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        redrawOnParentResize: false,
        redrawOnWindowResize: false
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '11px', colors: ['#fff'], fontWeight: 'bold' }
      },
      legend: { show: false }
    };
  }

  connectedCallback() {
    // Renderuj tylko raz.
    if (!this.rendered) {
      this.className = 'flex-1 min-h-0 p-2 overflow-hidden';
      this.innerHTML = '<div id="report-chart-container"></div>';
      this.rendered = true;
    }
  }

  /**
   * Renderuje wykres z podanymi danymi.
   * @param {Object} options - Opcje wykresu
   * @param {Array} options.data - Dane [{x: 'Label', y: wartość}, ...]
   * @param {number} options.height - Wysokość wykresu (opcjonalna, domyślnie auto z rodzica)
   * @param {Function} options.formatter - Formatter etykiet (opcjonalny)
   */
  render({ data, height = null, formatter = null }) {
    // Zniszcz poprzedni wykres jeśli istnieje
    if (this.chart) {
      this.chart.destroy();
    }

    const container = this.querySelector('#report-chart-container');
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const computedHeight = height || this.offsetHeight || 400;
        
        const config = {
          ...this.defaults,
          chart: {
            ...this.defaults.chart,
            height: computedHeight,
            width: '100%'  // ApexCharts auto-size do szerokości kontenera
          },
          series: [{ data }]
        };

        // Dodaj formatter jeśli podany
        if (formatter) {
          config.dataLabels.formatter = formatter;
          config.xaxis = {
            labels: { formatter }
          };
        }

        this.chart = new ApexCharts(container, config);
        this.chart.render();
      });
    });
  }

  disconnectedCallback() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

customElements.define('report-chart', ReportChart);
