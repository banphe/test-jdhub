/**
 * Formattery do prezentacji wartości w UI.
 * Reużywalne w całej aplikacji (wykresy, tabele, etykiety).
 */
export default class Formatters {
  
  currency(val) {
    return `${val.toLocaleString('pl-PL')} zł`;
  }
  
  percent(val) {
    return `${val}%`;
  }
  
  hours(val) {
    return `${val}h`;
  }
  
  forMetric(metric) {
    switch (metric) {
      case 'revenue': 
      case 'zlh':
        return this.currency.bind(this);
      case 'utilization': 
        return this.percent.bind(this);
      case 'hours': 
        return this.hours.bind(this);
      default:
        return (val) => `${val}`;
    }
  }
}
