// ==================== KONSTANTY ====================
// Aktualizuj te wartości gdy ZUS zmieni stawki (zwykle raz na rok)
const SKLADKI = {
  PRACOWNIK: {
    emerytalna: 0.0976,
    rentowa: 0.0150,
    chorobowa: 0.0245,    // dobrowolna - sprawdź czy pracownik chce
    zdrowotna: 0.0900
  },
  
  FIRMA: {
    razem: 0.2048  // 20,48% - ile EXTRA płacisz ponad brutto
  }
};

const INNE = {
  kup: 0.20,      // odliczenie podatkowe - zawsze 20% dla zlecenia
  podatek: 0.12   // pierwszy próg - większość ludzi tu jest
};

// ==================== FUNKCJE POMOCNICZE ====================

// Ile pracownik oddaje do ZUS (jego część)
function skladkiPracownik(brutto) {
  return brutto * (
    SKLADKI.PRACOWNIK.emerytalna + 
    SKLADKI.PRACOWNIK.rentowa + 
    SKLADKI.PRACOWNIK.chorobowa
  );
}

// Ile pracownik płaci za NFZ
function skladkaZdrowotna(brutto, skladkiSpol) {
  const podstawa = brutto - skladkiSpol;
  return podstawa * SKLADKI.PRACOWNIK.zdrowotna;
}

// Odliczenie podatkowe - zmniejsza podatek
function kup(brutto, skladkiSpol) {
  const podstawa = brutto - skladkiSpol;
  return podstawa * INNE.kup;
}

// Ile pracownik płaci podatku
function podatek(brutto, skladkiSpol, kup) {
  const podstawa = brutto - skladkiSpol - kup;
  return podstawa * INNE.podatek;
}

// ==================== GŁÓWNE FUNKCJE ====================

// UŻYJ TEGO gdy: pracownik pyta "ile dostanę na rękę?"
// Przykład: "Mam umowę na 6000 brutto, ile to będzie netto?"
// student = bez składek i podatku, ponizej26 = bez podatku, chorobowa = składka 2,45%
function obliczNetto(brutto, student = false, ponizej26 = false, chorobowa = true) {
  // Student = brutto = netto (brak składek i podatku)
  if (student) {
    return brutto;
  }
  
  // Składki społeczne (z lub bez chorobowej)
  let skladki = brutto * (SKLADKI.PRACOWNIK.emerytalna + SKLADKI.PRACOWNIK.rentowa);
  if (chorobowa) {
    skladki += brutto * SKLADKI.PRACOWNIK.chorobowa;
  }
  
  const zdrowotna = skladkaZdrowotna(brutto, skladki);
  const koszty = kup(brutto, skladki);
  
  // Poniżej 26 = brak podatku
  const tax = ponizej26 ? 0 : podatek(brutto, skladki, koszty);
  
  return brutto - skladki - zdrowotna - tax;
}

// UŻYJ TEGO gdy: planujesz budżet lub kalkulujesz realne koszty
// Przykład: "Mam 10,000 zł budżetu, ile mogę zaoferować brutto?"
// student = firma nie płaci składek
function obliczKosztFirmy(brutto, student = false) {
  // Student = firma nie płaci składek
  if (student) {
    return brutto;
  }
  
  const skladkiFirmy = brutto * SKLADKI.FIRMA.razem;
  return brutto + skladkiFirmy;
}

// UŻYJ TEGO gdy: chcesz wiedzieć jakie brutto daje określone netto
// Przykład: "Pracownik chce 5000 netto, ile brutto muszę wpisać?"
function obliczBrutto(netto, student = false, ponizej26 = false, chorobowa = true) {
  // Student = netto = brutto
  if (student) {
    return netto;
  }
  
  // Suma składek społecznych pracownika
  let s = SKLADKI.PRACOWNIK.emerytalna + SKLADKI.PRACOWNIK.rentowa;
  if (chorobowa) {
    s += SKLADKI.PRACOWNIK.chorobowa;
  }
  
  // Wzór odwrotny: brutto = netto / współczynnik
  let wspolczynnik;
  
  if (ponizej26) {
    // Bez podatku: netto = brutto * [1 - s - (1-s)*0.09]
    wspolczynnik = 1 - s - (1 - s) * SKLADKI.PRACOWNIK.zdrowotna;
  } else {
    // Z podatkiem: netto = brutto * [1 - s - (1-s)*0.09 - (1-s)*0.8*0.12]
    const podstawaWspolczynnik = 1 - s;
    const odliczenie = 1 - INNE.kup;
    wspolczynnik = 1 - s - podstawaWspolczynnik * SKLADKI.PRACOWNIK.zdrowotna - podstawaWspolczynnik * odliczenie * INNE.podatek;
  }
  
  return netto / wspolczynnik;
}

// ==================== PRAKTYCZNE PRZYKŁADY ====================

const brutto = 6000;

// Zwykły pracownik (z chorobową - domyślnie)
console.log('Zwykły z chorobową:', obliczNetto(brutto), 'netto');
console.log('Koszt firmy:', obliczKosztFirmy(brutto));

// Zwykły pracownik BEZ chorobowej
console.log('Zwykły bez chorobowej:', obliczNetto(brutto, false, false, false), 'netto');

// Osoba poniżej 26 lat (składki są, podatku brak)
console.log('Poniżej 26:', obliczNetto(brutto, false, true), 'netto');
console.log('Koszt firmy:', obliczKosztFirmy(brutto));  // firma płaci składki normalnie

// Student (brutto = netto, firma nie płaci składek)
console.log('Student:', obliczNetto(brutto, true), 'netto');
console.log('Koszt firmy:', obliczKosztFirmy(brutto, true));