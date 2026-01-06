/**
 * Komponent wykresu raportowego oparty na ApexCharts.
 * Enkapsuluje domyślną konfigurację - wystarczy podać dane.
 */
export default class ReportChart extends HTMLElement {
  constructor() {
    super();
    this.chart = null;
    this.rendered = false;
    
    // Domyślna konfiguracja
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
          borderRadius: 4,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        style: { 
          fontSize: '11px', 
          fontWeight: 'bold',
          colors: ['#333333']
        },
        offsetX: 5,
        textAnchor: 'start',
        background: { enabled: false }
      },
      legend: { show: false }
    };
  }

  connectedCallback() {
    if (!this.rendered) {
      this.className = 'flex-1 min-h-0 p-2 overflow-hidden';
      this.innerHTML = `
        <div id="metric-label" class="text-center font-semibold text-gray-700 text-sm py-1"></div>
        <div id="report-chart-container"></div>
      `;
      this.rendered = true;
    }
  }

  /**
   * Renderuje wykres z podanymi danymi.
   * @param {Object} options - Opcje wykresu
   * @param {Array} options.data - Dane [{x: 'Label', y: wartość}, ...]
   * @param {number} options.height - Wysokość wykresu
   * @param {Function} options.labelFormatter - Formatter etykiet na słupkach
   * @param {Function} options.axisFormatter - Formatter wartości osi X
   * @param {string} options.label - Nazwa aktualnej metryki
   */
  render({ data, height = null, labelFormatter = null, axisFormatter = null, label = '' }) {
    if (this.chart) {
      this.chart.destroy();
    }

    const labelEl = this.querySelector('#metric-label');
    if (labelEl) labelEl.textContent = label;

    const container = this.querySelector('#report-chart-container');
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const computedHeight = height || this.offsetHeight - 30 || 400;
        
        const config = {
          ...this.defaults,
          chart: {
            ...this.defaults.chart,
            height: computedHeight,
            width: '100%'
          },
          series: [{ data }],
          dataLabels: {
            ...this.defaults.dataLabels,
            formatter: labelFormatter || ((val) => val)
          },
          xaxis: {
            labels: { formatter: axisFormatter || labelFormatter }
          }
        };

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
