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
  aggregateToMonthly(bookings, therapists = []) {
    const monthsMap = {};
    const daysOffMap = this.#buildDaysOffMap(therapists);
    
    console.log('DEBUG: Therapists count:', therapists.length);
    console.log('DEBUG: Therapists:', therapists);
    
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
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hoursAvailable = this.#calculateDayAvailableHours(therapists, dateStr, daysOffMap);
        
        monthsMap[monthKey].days[day] = {
          day,
          net: 0,
          count: 0,
          utilization: { hoursWorked: 0, hoursAvailable, percentage: 0 }
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
    
    // Oblicz hoursAvailable i percentage dla miesięcy
    Object.values(monthsMap).forEach(month => {
      Object.values(month.days).forEach(day => {
        month.utilization.hoursAvailable += day.utilization.hoursAvailable;
      });
      
      if (month.utilization.hoursAvailable > 0) {
        month.utilization.percentage = Math.round(
          (month.utilization.hoursWorked / month.utilization.hoursAvailable) * 100
        );
      }
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
  
  /**
   * Buduje mapę dni wolnych dla szybkiego dostępu O(1).
   * Klucz: "YYYY-MM-DD_TherapistName"
   */
  #buildDaysOffMap(therapists) {
    const map = {};
    therapists.forEach(therapist => {
      const daysOff = therapist.daysOff || [];
      daysOff.forEach(dateStr => {
        const key = `${dateStr}_${therapist.name}`;
        map[key] = true;
      });
    });
    return map;
  }
  
  /**
   * Oblicza ile godzin jest dostępnych danego dnia.
   * Suma dla wszystkich terapeutów bez day off.
   * Każdy terapeuta = 13h (10:00-23:00).
   */
  #calculateDayAvailableHours(therapists, dateStr, daysOffMap) {
    let availableTherapists = 0;
    
    therapists.forEach(therapist => {
      const dayOffKey = `${dateStr}_${therapist.name}`;
      if (!daysOffMap[dayOffKey]) {
        availableTherapists++;
      }
    });
    
    const hours = availableTherapists * 13;
    if (dateStr === '2025-12-30') {
      console.log('DEBUG 30 grudnia:', {
        therapists: therapists.length,
        availableTherapists,
        hoursAvailable: hours,
        daysOffMap
      });
    }
    
    return hours;
  }
}
