/**
 * Mock danych raportowych - surowe rezerwacje (bookings).
 * Struktura identyczna jak zwraca Firebase Firestore (bookings collection).
 */

/**
 * Generuje losową wartość w zakresie.
 */
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generuje losowe bookings dla 8 miesięcy (czerwiec-sierpień 2025).
 * Zwraca surowe rezerwacje - format identyczny jak Firebase.
 */
export function generateMockReportBookings() {
  const bookings = [];
  let bookingId = 1;
  
  // Generuj dla miesięcy: czerwiec-grudzień 2025
  const months = [
    { year: 2025, month: 6, days: 30 },
    { year: 2025, month: 7, days: 31 },
    { year: 2025, month: 8, days: 31 },
    { year: 2025, month: 9, days: 30 },
    { year: 2025, month: 10, days: 31 },
    { year: 2025, month: 11, days: 30 },
    { year: 2025, month: 12, days: 31 }
  ];
  
  months.forEach(({ year, month, days }) => {
    // Losowa liczba dni z rezerwacjami (60-90% dni miesiąca)
    const daysWithBookings = Math.floor(days * (0.6 + Math.random() * 0.3));
    const selectedDays = new Set();
    
    while (selectedDays.size < daysWithBookings) {
      selectedDays.add(randomInRange(1, days));
    }
    
    selectedDays.forEach(day => {
      // 1-8 rezerwacji na dzień
      const bookingsPerDay = randomInRange(1, 8);
      
      for (let i = 0; i < bookingsPerDay; i++) {
        const hour = randomInRange(8, 21);
        const minute = randomInRange(0, 1) * 30; // 00 lub 30
        const duration = [60, 90, 120][randomInRange(0, 2)]; // 60, 90 lub 120 min
        
        const start = new Date(year, month - 1, day, hour, minute);
        const end = new Date(start.getTime() + duration * 60000);
        
        bookings.push({
          id: `mock-booking-${bookingId++}`,
          start: start.toISOString(),
          end: end.toISOString(),
          price: randomInRange(100, 400),
          duration,
          status: 'confirmed'
        });
      }
    });
  });
  
  return bookings;
}

