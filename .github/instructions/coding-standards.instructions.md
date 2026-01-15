---
applyTo: "**"
---

# Standardy kodowania

## Filozofia

Kod dla początkujących w JS z backgroundem VB.NET. Priorytet: czytelność nad zwięzłość.

## Formatowanie

- Krótkie linie - jedna operacja na linię
- Unikaj zagnieżdżeń - wyrażenia na osobnych zmiennych
- Średniki zawsze
- Apostrofy dla stringów

## Nazewnictwo

- `camelCase` - zmienne, funkcje
- `PascalCase` - klasy, konstruktory
- `UPPER_SNAKE_CASE` - stałe (constants.js)
- Minimalistyczne ale opisowe

## Web Components

- Instancje przez `new Component({ className })` + `appendChild()`
- NIE przez `innerHTML` z `<tag-name>`
- Opcje w konstruktorze dla konfiguracji

## Przykład dobrego stylu

```javascript
const container = document.getElementById('app');
const view = new CalendarView();
const service = new CalendarService();

view.onRendered = handleRendered;
container.appendChild(view);
```

## Unikaj

```javascript
// ŹLE - wszystko w jednej linii
const x = someFunc(data.filter(x => x.id > 5).map(x => x.name));

// DOBRZE - rozbite na kroki
const filtered = data.filter(item => item.id > 5);
const names = filtered.map(item => item.name);
const result = someFunc(names);
```
