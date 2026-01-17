/**
 * Symulacja biznesu salonu masaży
 * Model - dane i obliczenia
 */

class SalonSimulation {
  constructor() {
    this.parameters = {
      hoursOpen: 10,              // A: Godziny otwarcia (1-14)
      cabins: 2,                  // B: Gabinety (1-10)
      therapists: 4,              // C: Masażyści (1-10)
      massageHours: 5,            // D: Masazogodziny (0-10)
      therapistAvailability: 10,  // E: Dostępność masażysty (0-14)
      monthlyCosts: 6000,         // F: Koszty miesięczne stałe (500-50000)
      hourlyRevenue: 140,         // G: Przychód za masażogodzinę (50-300)
      therapistHourlyRate: 75     // H: Stawka godzinowa masażysty (30-150)
    };

    this.limits = {
      hoursOpen: { min: 1, max: 14 },
      cabins: { min: 1, max: 10 },
      therapists: { min: 1, max: 10 },
      massageHours: { min: 0, max: 10, step: 0.5 },
      therapistAvailability: { min: 0, max: 14 },
      monthlyCosts: { min: 500, max: 50000, step: 500 },
      hourlyRevenue: { min: 50, max: 300, step: 10 },
      therapistHourlyRate: { min: 30, max: 150, step: 5 }
    };
  }

  updateParameter(name, value) {
    if (this.parameters.hasOwnProperty(name)) {
      this.parameters[name] = value;
    }
  }

  getParameter(name) {
    return this.parameters[name];
  }

  getLimit(name) {
    return this.limits[name];
  }

  calculate() {
    const { hoursOpen, cabins, therapists, massageHours, therapistAvailability, monthlyCosts, hourlyRevenue, therapistHourlyRate } = this.parameters;
    
    const gabinetogodziny = hoursOpen * cabins;
    const roboczogodziny = therapists * massageHours;
    const wykorzystanieSalonu = gabinetogodziny > 0 ? (roboczogodziny / gabinetogodziny) * 100 : 0;
    const dostepnoscBooksy = therapists * therapistAvailability;
    const wykorzystanieMasazysty = therapistAvailability > 0 ? (massageHours / therapistAvailability) * 100 : 0;
    
    // Obliczenia finansowe
    const przychodDzienny = roboczogodziny * hourlyRevenue;
    const kosztMasazystowDzienny = roboczogodziny * therapistHourlyRate;
    const marzaDzienna = przychodDzienny - kosztMasazystowDzienny;
    const dochodMiesieczny = (marzaDzienna * 30) - monthlyCosts;
    const dochodMasazystyMiesieczny = therapistHourlyRate * massageHours * 30;
    
    // Break-even point
    const marzaNaGodzine = hourlyRevenue - therapistHourlyRate;
    const breakEvenRoboczogodzinyDziennie = marzaNaGodzine > 0 ? monthlyCosts / (marzaNaGodzine * 30) : 0;
    
    return {
      gabinetogodziny,
      roboczogodziny,
      wykorzystanieSalonu,
      dostepnoscBooksy,
      wykorzystanieMasazysty,
      marzaDzienna,
      dochodMiesieczny,
      dochodMasazystyMiesieczny,
      breakEvenRoboczogodzinyDziennie
    };
  }
}

if (typeof window !== 'undefined') {
  window.SalonSimulation = SalonSimulation;
}
