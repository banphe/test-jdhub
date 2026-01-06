/**
 * Mock danych raportowych - 8 miesięcy z 2025 roku.
 * Struktura identyczna jak zwraca ReportService.getReportData().
 */

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

// Ile dni ma każdy miesiąc w 2025
const DAYS_IN_MONTH = {
  '2025-01': 31, '2025-02': 28, '2025-03': 31, '2025-04': 30,
  '2025-05': 31, '2025-06': 30, '2025-07': 31, '2025-08': 31
};

/**
 * Generuje losową wartość w zakresie.
 */
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generuje dane dla jednego dnia.
 */
function generateDay(day) {
  const hoursWorked = randomInRange(2, 20);
  const hoursAvailable = 30; // 2 masażystki × 15h dostępności
  const net = randomInRange(200, 2500);
  const count = randomInRange(1, 8);
  
  return {
    day,
    net,
    count,
    utilization: {
      hoursWorked,
      hoursAvailable,
      percentage: Math.round((hoursWorked / hoursAvailable) * 100)
    }
  };
}

/**
 * Generuje dane dla jednego miesiąca.
 */
function generateMonth(key) {
  const [year, monthNum] = key.split('-').map(Number);
  const daysCount = DAYS_IN_MONTH[key];
  const days = {};
  
  let totalNet = 0;
  let totalCount = 0;
  let totalHoursWorked = 0;
  let totalHoursAvailable = 0;
  
  for (let day = 1; day <= daysCount; day++) {
    const dayData = generateDay(day);
    days[day] = dayData;
    
    totalNet += dayData.net;
    totalCount += dayData.count;
    totalHoursWorked += dayData.utilization.hoursWorked;
    totalHoursAvailable += dayData.utilization.hoursAvailable;
  }
  
  return {
    key,
    monthName: MONTH_NAMES[monthNum - 1],
    year,
    days,
    totalNet,
    totalCount,
    utilization: {
      hoursWorked: totalHoursWorked,
      hoursAvailable: totalHoursAvailable,
      percentage: Math.round((totalHoursWorked / totalHoursAvailable) * 100)
    }
  };
}

/**
 * Generuje kompletne dane raportowe dla 8 miesięcy.
 * Zwraca tablicę miesięcy posortowaną chronologicznie.
 */
export function generateMockReportData() {
  return Object.keys(DAYS_IN_MONTH)
    .sort()
    .map(key => generateMonth(key));
}

/**
 * Statyczne dane (nie losowe) - do przewidywalnych testów.
 */
export const STATIC_MOCK_DATA = {
  '2025-01': {
    monthName: 'Styczeń',
    year: 2025,
    month: 0,
    totalNet: 42500,
    totalCount: 85,
    utilization: { hoursWorked: 280, hoursAvailable: 930, percentage: 30 },
    days: {
      1: { day: 1, net: 1200, count: 3, utilization: { hoursWorked: 8, hoursAvailable: 30, percentage: 27 } },
      2: { day: 2, net: 1800, count: 4, utilization: { hoursWorked: 12, hoursAvailable: 30, percentage: 40 } },
      3: { day: 3, net: 950, count: 2, utilization: { hoursWorked: 6, hoursAvailable: 30, percentage: 20 } }
      // ... reszta dni generowana dynamicznie przy użyciu generateMockReportData()
    }
  },
  '2025-02': {
    monthName: 'Luty',
    year: 2025,
    month: 1,
    totalNet: 38200,
    totalCount: 76,
    utilization: { hoursWorked: 252, hoursAvailable: 840, percentage: 30 },
    days: {}
  },
  '2025-03': {
    monthName: 'Marzec',
    year: 2025,
    month: 2,
    totalNet: 51000,
    totalCount: 102,
    utilization: { hoursWorked: 340, hoursAvailable: 930, percentage: 37 },
    days: {}
  },
  '2025-04': {
    monthName: 'Kwiecień',
    year: 2025,
    month: 3,
    totalNet: 48700,
    totalCount: 97,
    utilization: { hoursWorked: 315, hoursAvailable: 900, percentage: 35 },
    days: {}
  },
  '2025-05': {
    monthName: 'Maj',
    year: 2025,
    month: 4,
    totalNet: 55200,
    totalCount: 110,
    utilization: { hoursWorked: 372, hoursAvailable: 930, percentage: 40 },
    days: {}
  },
  '2025-06': {
    monthName: 'Czerwiec',
    year: 2025,
    month: 5,
    totalNet: 62100,
    totalCount: 124,
    utilization: { hoursWorked: 405, hoursAvailable: 900, percentage: 45 },
    days: {}
  },
  '2025-07': {
    monthName: 'Lipiec',
    year: 2025,
    month: 6,
    totalNet: 58400,
    totalCount: 117,
    utilization: { hoursWorked: 390, hoursAvailable: 930, percentage: 42 },
    days: {}
  },
  '2025-08': {
    monthName: 'Sierpień',
    year: 2025,
    month: 7,
    totalNet: 53800,
    totalCount: 108,
    utilization: { hoursWorked: 355, hoursAvailable: 930, percentage: 38 },
    days: {}
  }
};

export default { generateMockReportData, STATIC_MOCK_DATA };
