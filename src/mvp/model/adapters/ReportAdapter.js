/**
 * Transformuje dane raportowe na formaty UI.
 */
export default class ReportAdapter {
  
  forChart(mode, data, selectedMonth, metric) {
    return mode === 'daily'
      ? this.#daily(selectedMonth.days, metric)
      : this.#monthly(data, metric);
  }
  
  forDropdown(data) {
    return [...data].map(month => ({
      key: month.key,
      label: `${month.monthName} ${month.year}`
    }));
  }
  
  #daily(daysObject, metric) {
    return Object.values(daysObject).map(day => ({
      x: `${day.day}`,
      y: this.#extractDayMetric(day, metric)
    }));
  }
  
  #monthly(data, metric) {
    return data.map(month => ({
      x: month.monthName.substring(0, 3),
      y: this.#extractMonthMetric(month, metric)
    }));
  }
  
  #extractDayMetric(day, metric) {
    switch (metric) {
      case 'revenue':
        return day.net;
      case 'utilization':
        return day.utilization.percentage;
      case 'hours':
        return day.utilization.hoursWorked;
      case 'zlh':
        return day.utilization.hoursWorked > 0 
          ? Math.round(day.net / day.utilization.hoursWorked) 
          : 0;
      default:
        return 0;
    }
  }
  
  #extractMonthMetric(month, metric) {
    switch (metric) {
      case 'revenue':
        return month.totalNet;
      case 'utilization':
        return month.utilization.percentage;
      case 'hours':
        return month.utilization.hoursWorked;
      case 'zlh':
        return month.utilization.hoursWorked > 0 
          ? Math.round(month.totalNet / month.utilization.hoursWorked) 
          : 0;
      default:
        return 0;
    }
  }
}
