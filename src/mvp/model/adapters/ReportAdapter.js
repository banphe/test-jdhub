import { BOOKING_STATUS } from '../../config/constants.js';

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
    
    // Filtruj anulowane i nieobecności
    const validBookings = bookings.filter(b => 
      b.status !== BOOKING_STATUS.CANCELLED && 
      b.status !== BOOKING_STATUS.NOSHOW
    );
    
    validBookings.forEach(booking => {
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
      
      // Oblicz netto po voucherach
      const net = (booking.price || 0) - (booking.voucherAmount || 0);
      
      // Oblicz duration z różnicy end-start (w godzinach)
      const duration = (new Date(booking.end) - new Date(booking.start)) / (1000 * 60 * 60);
      
      // Oblicz godziny - każda masażystka w services osobno
      const services = booking.services || [];
      const therapistHours = services.length * duration;
      
      dayData.net += net;
      dayData.count += 1;
      dayData.utilization.hoursWorked += therapistHours;
      dayData.utilization.percentage = Math.round(
        (dayData.utilization.hoursWorked / dayData.utilization.hoursAvailable) * 100
      );
      
      monthsMap[monthKey].totalNet += net;
      monthsMap[monthKey].totalCount += 1;
      monthsMap[monthKey].utilization.hoursWorked += therapistHours;
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
        return Math.round(day.net);
      case 'utilization':
        return day.utilization.percentage;
      case 'hours':
        return parseFloat(day.utilization.hoursWorked.toFixed(1));
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
        return Math.round(month.totalNet);
      case 'utilization':
        return month.utilization.percentage;
      case 'hours':
        return parseFloat(month.utilization.hoursWorked.toFixed(1));
      case 'zlh':
        return month.utilization.hoursWorked > 0 
          ? Math.round(month.totalNet / month.utilization.hoursWorked) 
          : 0;
      default:
        return 0;
    }
  }
}
