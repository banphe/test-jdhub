/**
 * Centralna konfiguracja stylowania (Tailwind classes).
 * Używane przez komponenty i widoki dla spójnego wyglądu aplikacji.
 */
export const theme = {
  colors: {
    background: 'gray-200', // index.html → body className
    surface: 'bg-white', // app.js → NavBar bgColor, nav-bar.js → nav element
    textActive: 'text-blue-500', // app.js → NavBar activeColor, nav-link.js → setActive()
    textInactive: 'text-gray-600' // nav-link.js → anchor default color, setActive()
  },
  
  spacing: {
    navHeight: 'h-16', // app.js → NavBar height, nav-bar.js → nav element
    containerPadding: 'p-4' // app.js → AppContainer padding, app-container.js
  },
  
  text: {
    heading: 'text-2xl', // KalendarzView.js, RaportyView.js → h1
    iconSize: 'text-xl', // nav-link.js → iconElement
    small: 'text-xs' // nav-link.js → textElement
  },
  
  layout: {
    navFull: 'w-full', // nav-bar.js → nav element width
    navBorder: 'border-t', // nav-bar.js → nav element top border
    navFlex: 'flex justify-around items-center' // nav-bar.js → nav element flexbox
  },
  
  // Górny toolbar raportów
  toolbar: {
    container: 'flex items-center bg-white border-b border-gray-300 shadow',
    containerPadding: 'px-1 py-1', // Padding całego toolbara
    divider: 'border-r border-gray-300', // Linia separatora
    dividerSpacing: 'pr-1 mr-1', // Odstępy przy separatorze
    
    // Przyciski (toggle D/M i metryki)
    buttonSize: 'p-2', // Padding przycisku (p-1, p-2, p-3...)
    buttonText: 'text-sm', // Rozmiar tekstu/ikony
    buttonActive: 'bg-blue-500 text-white',
    buttonInactive: 'text-gray-600',
    buttonHover: 'hover:bg-gray-100',
    buttonRounded: 'rounded', // Zaokrąglenie (rounded-sm, rounded, rounded-lg)
    
    // Select miesiąca
    selectSize: 'px-2 py-1 text-sm', // Padding i tekst selecta
    selectStyle: 'border border-gray-300 rounded bg-white',
    
    // Sekcja metryk (4 przyciski)
    metricsContainer: 'flex-1 flex justify-around',
    metricsGap: 'gap-1' // Odstęp między przyciskami metryk
  }
};
