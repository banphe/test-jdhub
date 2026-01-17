/**
 * Kontroler UI - event listenery i aktualizacja widoku
 */

class App {
  constructor() {
    this.simulation = new SalonSimulation();
    this.validation = new Validation(this.simulation);
    this.initElements();
    this.initEventListeners();
    this.updateUI();
  }

  initElements() {
    // Wartości wyświetlane
    this.elements = {
      hoursValue: document.getElementById('hoursValue'),
      cabinsValue: document.getElementById('cabinsValue'),
      therapistsValue: document.getElementById('therapistsValue'),
      massageHoursValue: document.getElementById('massageHoursValue'),
      therapistAvailabilityValue: document.getElementById('therapistAvailabilityValue'),
      monthlyCostsValue: document.getElementById('monthlyCostsValue'),
      hourlyRevenueValue: document.getElementById('hourlyRevenueValue'),
      therapistHourlyRateValue: document.getElementById('therapistHourlyRateValue'),
      results: document.getElementById('results')
    };

    // Przyciski
    this.buttons = {
      hoursOpenDec: document.getElementById('hoursOpenDec'),
      hoursOpenInc: document.getElementById('hoursOpenInc'),
      cabinsDec: document.getElementById('cabinsDec'),
      cabinsInc: document.getElementById('cabinsInc'),
      therapistsDec: document.getElementById('therapistsDec'),
      therapistsInc: document.getElementById('therapistsInc'),
      massageHoursDec: document.getElementById('massageHoursDec'),
      massageHoursInc: document.getElementById('massageHoursInc'),
      therapistAvailabilityDec: document.getElementById('therapistAvailabilityDec'),
      therapistAvailabilityInc: document.getElementById('therapistAvailabilityInc'),
      monthlyCostsDec: document.getElementById('monthlyCostsDec'),
      monthlyCostsInc: document.getElementById('monthlyCostsInc'),
      hourlyRevenueDec: document.getElementById('hourlyRevenueDec'),
      hourlyRevenueInc: document.getElementById('hourlyRevenueInc'),
      therapistHourlyRateDec: document.getElementById('therapistHourlyRateDec'),
      therapistHourlyRateInc: document.getElementById('therapistHourlyRateInc')
    };
  }

  initEventListeners() {
    // Godziny otwarcia
    this.buttons.hoursOpenDec.addEventListener('click', () => {
      if (this.validation.canDecreaseHoursOpen()) {
        this.changeParameter('hoursOpen', -1);
      }
    });

    this.buttons.hoursOpenInc.addEventListener('click', () => {
      if (this.validation.canIncreaseHoursOpen()) {
        this.changeParameter('hoursOpen', 1);
      }
    });

    // Gabinety
    this.buttons.cabinsDec.addEventListener('click', () => {
      if (this.validation.canDecreaseCabins()) {
        this.changeParameter('cabins', -1);
      }
    });

    this.buttons.cabinsInc.addEventListener('click', () => {
      if (this.validation.canIncreaseCabins()) {
        this.changeParameter('cabins', 1);
      }
    });

    // Masażyści
    this.buttons.therapistsDec.addEventListener('click', () => {
      if (this.validation.canDecreaseTherapists()) {
        this.changeParameter('therapists', -1);
      }
    });

    this.buttons.therapistsInc.addEventListener('click', () => {
      if (this.validation.canIncreaseTherapists()) {
        this.changeParameter('therapists', 1);
      }
    });

    // Masazogodziny
    this.buttons.massageHoursDec.addEventListener('click', () => {
      if (this.validation.canDecreaseMassageHours()) {
        this.changeParameter('massageHours', -0.5);
      }
    });

    this.buttons.massageHoursInc.addEventListener('click', () => {
      if (this.validation.canIncreaseMassageHours()) {
        this.changeParameter('massageHours', 0.5);
      }
    });

    // Dostępność masażysty
    this.buttons.therapistAvailabilityDec.addEventListener('click', () => {
      if (this.validation.canDecreaseTherapistAvailability()) {
        this.changeParameter('therapistAvailability', -1);
      }
    });

    this.buttons.therapistAvailabilityInc.addEventListener('click', () => {
      if (this.validation.canIncreaseTherapistAvailability()) {
        this.changeParameter('therapistAvailability', 1);
      }
    });

    // Koszty miesięczne
    this.buttons.monthlyCostsDec.addEventListener('click', () => {
      if (this.validation.canDecreaseMonthlyCosts()) {
        const step = this.simulation.getLimit('monthlyCosts').step;
        this.changeParameter('monthlyCosts', -step);
      }
    });

    this.buttons.monthlyCostsInc.addEventListener('click', () => {
      if (this.validation.canIncreaseMonthlyCosts()) {
        const step = this.simulation.getLimit('monthlyCosts').step;
        this.changeParameter('monthlyCosts', step);
      }
    });

    // Przychód za masażogodzinę
    this.buttons.hourlyRevenueDec.addEventListener('click', () => {
      if (this.validation.canDecreaseHourlyRevenue()) {
        const step = this.simulation.getLimit('hourlyRevenue').step;
        this.changeParameter('hourlyRevenue', -step);
      }
    });

    this.buttons.hourlyRevenueInc.addEventListener('click', () => {
      if (this.validation.canIncreaseHourlyRevenue()) {
        const step = this.simulation.getLimit('hourlyRevenue').step;
        this.changeParameter('hourlyRevenue', step);
      }
    });

    // Stawka godzinowa masażysty
    this.buttons.therapistHourlyRateDec.addEventListener('click', () => {
      if (this.validation.canDecreaseTherapistHourlyRate()) {
        const step = this.simulation.getLimit('therapistHourlyRate').step;
        this.changeParameter('therapistHourlyRate', -step);
      }
    });

    this.buttons.therapistHourlyRateInc.addEventListener('click', () => {
      if (this.validation.canIncreaseTherapistHourlyRate()) {
        const step = this.simulation.getLimit('therapistHourlyRate').step;
        this.changeParameter('therapistHourlyRate', step);
      }
    });
  }

  changeParameter(name, delta) {
    const current = this.simulation.getParameter(name);
    this.simulation.updateParameter(name, current + delta);
    this.updateUI();
  }

  updateUI() {
    this.updateValues();
    this.updateResults();
    this.updateButtonStates();
  }

  updateValues() {
    this.elements.hoursValue.textContent = this.simulation.getParameter('hoursOpen');
    this.elements.cabinsValue.textContent = this.simulation.getParameter('cabins');
    this.elements.therapistsValue.textContent = this.simulation.getParameter('therapists');
    this.elements.massageHoursValue.textContent = this.simulation.getParameter('massageHours');
    this.elements.therapistAvailabilityValue.textContent = this.simulation.getParameter('therapistAvailability');
    this.elements.monthlyCostsValue.textContent = this.simulation.getParameter('monthlyCosts');
    this.elements.hourlyRevenueValue.textContent = this.simulation.getParameter('hourlyRevenue');
    this.elements.therapistHourlyRateValue.textContent = this.simulation.getParameter('therapistHourlyRate');
  }

  updateResults() {
    const results = this.simulation.calculate();
    
    this.elements.results.innerHTML = `
      <div class="w-full flex flex-wrap gap-3">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 min-w-[140px]" title="Łączna dostępność wszystkich gabinetów w godzinach dziennie">
          <div class="text-xs text-gray-600 mb-1">Dostępność Gabinetu</div>
          <div class="text-2xl font-bold text-blue-600">${results.gabinetogodziny}</div>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 min-w-[140px]" title="Łączna dostępność masażystów w systemie Booksy (godziny dziennie)">
          <div class="text-xs text-gray-600 mb-1">Dostępność Booksy</div>
          <div class="text-2xl font-bold text-amber-600">${results.dostepnoscBooksy}</div>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg p-3 min-w-[140px]" title="Łączna liczba godzin masaży wykonywanych dziennie przez wszystkich masażystów">
          <div class="text-xs text-gray-600 mb-1">Roboczogodziny</div>
          <div class="text-2xl font-bold text-green-600">${results.roboczogodziny}</div>
        </div>
      </div>
      <div class="w-full flex flex-wrap gap-3 mt-3">
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-3 min-w-[140px]" title="Procent wykorzystania dostępnej pojemności salonu">
          <div class="text-xs text-gray-600 mb-1">Wykorzystanie salonu</div>
          <div class="text-2xl font-bold text-purple-600">${results.wykorzystanieSalonu.toFixed(1)}%</div>
        </div>
        <div class="bg-rose-50 border border-rose-200 rounded-lg p-3 min-w-[140px]" title="Procent wykorzystania czasu dostępności masażysty na wykonane masaże">
          <div class="text-xs text-gray-600 mb-1">Wykorzystanie masażysty</div>
          <div class="text-2xl font-bold text-rose-600">${results.wykorzystanieMasazysty.toFixed(1)}%</div>
        </div>
      </div>
      <div class="w-full flex flex-wrap gap-3 mt-3">
        <div class="bg-${results.marzaDzienna >= 0 ? 'emerald' : 'red'}-50 border border-${results.marzaDzienna >= 0 ? 'emerald' : 'red'}-200 rounded-lg p-3 min-w-[140px]" title="Dzienna marża (przychód - koszty masażystów)">
          <div class="text-xs text-gray-600 mb-1">Marża dzienna</div>
          <div class="text-2xl font-bold text-${results.marzaDzienna >= 0 ? 'emerald' : 'red'}-600">${results.marzaDzienna.toFixed(0)} zł</div>
        </div>
        <div class="bg-${results.dochodMiesieczny >= 0 ? 'lime' : 'red'}-50 border border-${results.dochodMiesieczny >= 0 ? 'lime' : 'red'}-200 rounded-lg p-3 min-w-[140px]" title="Miesięczny dochód salonu (marża × 30 - koszty stałe)">
          <div class="text-xs text-gray-600 mb-1">Dochód miesięczny</div>
          <div class="text-2xl font-bold text-${results.dochodMiesieczny >= 0 ? 'lime' : 'red'}-600">${results.dochodMiesieczny.toFixed(0)} zł</div>
        </div>
        <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 min-w-[140px]" title="Miesięczny dochód jednego masażysty">
          <div class="text-xs text-gray-600 mb-1">Dochód masażysty</div>
          <div class="text-2xl font-bold text-indigo-600">${results.dochodMasazystyMiesieczny.toFixed(0)} zł</div>
        </div>
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 min-w-[140px]" title="Minimalna liczba roboczogodzin dziennie potrzebna do wyjścia na zero">
          <div class="text-xs text-gray-600 mb-1">Break-even (h/dzień)</div>
          <div class="text-2xl font-bold text-orange-600">${results.breakEvenRoboczogodzinyDziennie.toFixed(1)}</div>
        </div>
      </div>
    `;
  }

  updateButtonStates() {
    const states = this.validation.getButtonStates();
    
    for (const [buttonId, enabled] of Object.entries(states)) {
      const button = this.buttons[buttonId];
      button.disabled = !enabled;
      
      if (enabled) {
        button.classList.remove('opacity-30', 'cursor-not-allowed');
        button.classList.add('hover:bg-gray-300');
      } else {
        button.classList.add('opacity-30', 'cursor-not-allowed');
        button.classList.remove('hover:bg-gray-300');
      }
    }
  }
}

// Uruchomienie aplikacji po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
