/**
 * Transformuje dane raportowe na formaty UI.
 * Agreguje surowe bookings do struktury miesięcznej oraz formatuje do wykresów.
 */
export default class ReportAdapter {
  
  /**
   * Agreguje surowe bookings do struktury miesięcznej.
   * Zwraca format: [{ key, monthName, year, days: {}, totalNet, totalCount, utilization }]
   */
  aggregateToMonthly(bookings) {
    const monthsMap = {};
    
    bookings.forEach(booking => {
      if (!booking.start) return;
      
      const date = new Date(booking.start);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const day = date.getDate();
      
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = {
          key: monthKey,
          monthName: date.toLocaleDateString('pl-PL', { month: 'long' }),
          year: date.getFullYear(),
          days: {},
          totalNet: 0,
          totalCount: 0,
          utilization: { hoursWorked: 0, hoursAvailable: 0, percentage: 0 }
        };
      }
      
      if (!monthsMap[monthKey].days[day]) {
        monthsMap[monthKey].days[day] = {
          day,
          net: 0,
          count: 0,
          utilization: { hoursWorked: 0, hoursAvailable: 30, percentage: 0 }
        };
      }
      
      const dayData = monthsMap[monthKey].days[day];
      const duration = booking.duration || 60;
      const hours = duration / 60;
      
      dayData.net += booking.price || 0;
      dayData.count += 1;
      dayData.utilization.hoursWorked += hours;
      dayData.utilization.percentage = Math.round(
        (dayData.utilization.hoursWorked / dayData.utilization.hoursAvailable) * 100
      );
      
      monthsMap[monthKey].totalNet += booking.price || 0;
      monthsMap[monthKey].totalCount += 1;
      monthsMap[monthKey].utilization.hoursWorked += hours;
    });
    
    // Oblicz percentage dla miesięcy
    Object.values(monthsMap).forEach(month => {
      const daysCount = Object.keys(month.days).length;
      month.utilization.hoursAvailable = daysCount * 30;
      month.utilization.percentage = Math.round(
        (month.utilization.hoursWorked / month.utilization.hoursAvailable) * 100
      );
    });
    
    // Zwróć tablicę posortowaną chronologicznie
    return Object.values(monthsMap).sort((a, b) => a.key.localeCompare(b.key));
  }
  
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
