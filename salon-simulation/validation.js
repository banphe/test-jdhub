/**
 * Walidacja - logika ograniczeń przycisków
 */

class Validation {
  constructor(simulation) {
    this.simulation = simulation;
  }

  // Pobierz aktualne wartości
  get A() { return this.simulation.getParameter('hoursOpen'); }
  get B() { return this.simulation.getParameter('cabins'); }
  get C() { return this.simulation.getParameter('therapists'); }
  get D() { return this.simulation.getParameter('massageHours'); }
  get E() { return this.simulation.getParameter('therapistAvailability'); }
  get F() { return this.simulation.getParameter('monthlyCosts'); }
  get G() { return this.simulation.getParameter('hourlyRevenue'); }
  get H() { return this.simulation.getParameter('therapistHourlyRate'); }

  // GODZINY OTWARCIA (A)
  canDecreaseHoursOpen() {
    const limit = this.simulation.getLimit('hoursOpen');
    if (this.A <= limit.min) return false;
    if ((this.A - 1) < this.D) return false;
    if ((this.A - 1) < this.E) return false;
    if (this.C * this.D > (this.A - 1) * this.B) return false;
    return true;
  }

  canIncreaseHoursOpen() {
    const limit = this.simulation.getLimit('hoursOpen');
    return this.A < limit.max;
  }

  // GABINETY (B)
  canDecreaseCabins() {
    const limit = this.simulation.getLimit('cabins');
    if (this.B <= limit.min) return false;
    if (this.C * this.D > this.A * (this.B - 1)) return false;
    return true;
  }

  canIncreaseCabins() {
    const limit = this.simulation.getLimit('cabins');
    return this.B < limit.max;
  }

  // MASAŻYŚCI (C)
  canDecreaseTherapists() {
    const limit = this.simulation.getLimit('therapists');
    return this.C > limit.min;
  }

  canIncreaseTherapists() {
    const limit = this.simulation.getLimit('therapists');
    if (this.C >= limit.max) return false;
    if ((this.C + 1) * this.D > this.A * this.B) return false;
    return true;
  }

  // MASAZOGODZINY (D)
  canDecreaseMassageHours() {
    const limit = this.simulation.getLimit('massageHours');
    return this.D > limit.min;
  }

  canIncreaseMassageHours() {
    const limit = this.simulation.getLimit('massageHours');
    if (this.D >= limit.max) return false;
    if ((this.D + 1) > this.A) return false;
    if ((this.D + 1) > this.E) return false;
    if (this.C * (this.D + 1) > this.A * this.B) return false;
    return true;
  }

  // DOSTĘPNOŚĆ MASAŻYSTY (E)
  canDecreaseTherapistAvailability() {
    const limit = this.simulation.getLimit('therapistAvailability');
    if (this.E <= limit.min) return false;
    if ((this.E - 1) < this.D) return false;
    return true;
  }

  canIncreaseTherapistAvailability() {
    const limit = this.simulation.getLimit('therapistAvailability');
    if (this.E >= limit.max) return false;
    if ((this.E + 1) > this.A) return false;
    return true;
  }

  // KOSZTY MIESIĘCZNE (F)
  canDecreaseMonthlyCosts() {
    const limit = this.simulation.getLimit('monthlyCosts');
    return this.F > limit.min;
  }

  canIncreaseMonthlyCosts() {
    const limit = this.simulation.getLimit('monthlyCosts');
    return this.F < limit.max;
  }

  // PRZYCHÓD ZA MASAŻOGODZINĘ (G)
  canDecreaseHourlyRevenue() {
    const limit = this.simulation.getLimit('hourlyRevenue');
    return this.G > limit.min;
  }

  canIncreaseHourlyRevenue() {
    const limit = this.simulation.getLimit('hourlyRevenue');
    return this.G < limit.max;
  }

  // STAWKA GODZINOWA MASAŻYSTY (H)
  canDecreaseTherapistHourlyRate() {
    const limit = this.simulation.getLimit('therapistHourlyRate');
    return this.H > limit.min;
  }

  canIncreaseTherapistHourlyRate() {
    const limit = this.simulation.getLimit('therapistHourlyRate');
    return this.H < limit.max;
  }

  // Zwraca stan wszystkich przycisków
  getButtonStates() {
    return {
      hoursOpenDec: this.canDecreaseHoursOpen(),
      hoursOpenInc: this.canIncreaseHoursOpen(),
      cabinsDec: this.canDecreaseCabins(),
      cabinsInc: this.canIncreaseCabins(),
      therapistsDec: this.canDecreaseTherapists(),
      therapistsInc: this.canIncreaseTherapists(),
      massageHoursDec: this.canDecreaseMassageHours(),
      massageHoursInc: this.canIncreaseMassageHours(),
      therapistAvailabilityDec: this.canDecreaseTherapistAvailability(),
      therapistAvailabilityInc: this.canIncreaseTherapistAvailability(),
      monthlyCostsDec: this.canDecreaseMonthlyCosts(),
      monthlyCostsInc: this.canIncreaseMonthlyCosts(),
      hourlyRevenueDec: this.canDecreaseHourlyRevenue(),
      hourlyRevenueInc: this.canIncreaseHourlyRevenue(),
      therapistHourlyRateDec: this.canDecreaseTherapistHourlyRate(),
      therapistHourlyRateInc: this.canIncreaseTherapistHourlyRate()
    };
  }
}

if (typeof window !== 'undefined') {
  window.Validation = Validation;
}
