const METRIC_LABELS = {
  revenue: 'Przychód',
  utilization: 'Obłożenie',
  hours: 'Godziny',
  zlh: 'zł/h'
};

export default class ReportPresenter {
  
  constructor(view, service, adapter, formatters) {
    this.view = view;
    this.service = service;
    this.adapter = adapter;
    this.formatters = formatters;
    
    this.data = null;
    this.selectedMonth = null;
    this.selectedMetric = 'revenue';
    this.selectedMode = 'daily';
    
    this.attachListeners();
  }

  async init() {
    if (!this.data) {
      this.data = await this.service.getReportData();
      this.selectedMonth = this.data[this.data.length - 1];
      this.view.setupToolbar(this.adapter.forDropdown(this.data), this.selectedMonth.key);
    }
    this.renderChart();
  }

  attachListeners() {
    this.view.toolbar.addEventListener('mode-change', (e) => {
      this.onModeChange(e.detail.mode);
    });

    this.view.toolbar.addEventListener('month-change', (e) => {
      this.onMonthChange(e.detail.monthKey);
    });

    this.view.toolbar.addEventListener('metric-change', (e) => {
      this.onMetricChange(e.detail.metric);
    });
  }

  onModeChange(mode) {
    this.selectedMode = mode;
    this.renderChart();
  }

  onMonthChange(monthKey) {
    this.selectedMonth = this.data.find(m => m.key === monthKey);
    this.renderChart();
  }

  onMetricChange(metric) {
    this.selectedMetric = metric;
    this.renderChart();
  }

  renderChart() {
    const chartData = this.adapter.forChart(
      this.selectedMode, this.data, this.selectedMonth, this.selectedMetric
    );
    
    const labelFormatter = this.formatters.forMetric(this.selectedMetric);
    const axisFormatter = (this.selectedMode === 'monthly' && this.selectedMetric === 'revenue')
      ? this.formatters.currencyCompact.bind(this.formatters)
      : labelFormatter;
    const metricLabel = METRIC_LABELS[this.selectedMetric];
    
    this.view.showChart(chartData, labelFormatter, axisFormatter, metricLabel);
  }
}
