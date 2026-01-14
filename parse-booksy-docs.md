# API Documentation - parseBooksy

## Przeznaczenie

Funkcja `parseBooksy` parsuje zrzuty ekranu z aplikacji mobilnej Booksy i zwraca ustrukturyzowane dane rezerwacji gotowe do zapisania w bazie Firestore.

**Funkcja NIE zapisuje danych do bazy** - tylko je przetwarza i zwraca. Odpowiedzialność za zapis leży po stronie frontend.

---

## Endpoint

**URL:** `https://us-central1-thairapy.cloudfunctions.net/parseBooksy`

**Metoda:** `POST`

**Content-Type:** `application/json`

---

## Request

### Format

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
}
```

### Parametry

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| image | string | TAK | Obraz zakodowany jako Data URL (base64 z prefiksem `data:image/jpeg;base64,`) |

---

## Response

### Sukces (200 OK)

```json
{
  "success": true,
  "data": {
    "booking": {
      "start": "2024-12-08T19:30:00+01:00",
      "end": "2024-12-08T21:00:00+01:00",
      "menuItemName": "Thairapy Deep Relax - masaż autorski",
      "services": [
        {
          "treatment": "Thairapy Deep Relax - masaż autorski",
          "therapist": "Kara"
        }
      ],
      "price": 200,
      "voucherAmount": 0,
      "status": "confirmed",
      "roomId": "lvB1qNXaCvHolapBglFT",
      "createdAt": "2025-01-14T12:29:45.456Z"
    },
    "customer": {
      "customerId": "501819504",
      "isNew": false,
      "data": {
        "firstName": "Igor",
        "lastName": "Kamiński",
        "createdAt": "2025-12-26T10:33:14.135Z"
      }
    }
  },
  "warnings": []
}
```

### Struktura danych: `booking`

| Pole | Typ | Opis |
|------|-----|------|
| start | string | Data i czas rozpoczęcia wizyty (ISO 8601 z timezone) |
| end | string | Data i czas zakończenia wizyty (ISO 8601 z timezone) |
| menuItemName | string | Nazwa usługi z menu |
| services | array | Tablica zabiegów z przypisanymi terapeutami |
| services[].treatment | string | Nazwa zabiegu |
| services[].therapist | string | Imię terapeuty |
| price | number | Cena zabiegu w złotych |
| voucherAmount | number | Wartość użytego vouchera/rabatu w złotych (0 jeśli brak) |
| status | string | Status rezerwacji |
| roomId | string | ID pokoju z Firestore |
| createdAt | string | Data utworzenia rekordu (ISO 8601) |

### Struktura danych: `customer`

| Pole | Typ | Opis |
|------|-----|------|
| customerId | string\|null | Znormalizowany numer telefonu (bez spacji) lub `null` dla szybkiej rezerwacji |
| isNew | boolean | `true` jeśli klient nie istnieje w bazie, `false` jeśli istnieje |
| data | object\|null | Dane klienta lub `null` dla szybkiej rezerwacji |
| data.firstName | string | Imię klienta |
| data.lastName | string | Nazwisko klienta |
| data.createdAt | string | Data utworzenia klienta w bazie (ISO 8601) |

### Struktura danych: `warnings`

Tablica ostrzeżeń (nie blokują zapisu). Może zawierać:

```json
{
  "type": "POTENTIAL_DUPLICATE",
  "message": "Podobna rezerwacja już istnieje (ten sam czas i zabieg)",
  "existingBooking": {
    "id": "abc123",
    "menuItemName": "...",
    "start": "2025-12-28T19:00:00+01:00",
    "end": "2025-12-28T21:00:00+01:00"
  }
}
```

---

## Przypadki specjalne

### 1. Masaż dla dwojga

Gdy `menuItemName` zawiera "Masaż dla dwojga":
- `services` jest **pustą tablicą** `[]`
- `roomName` zawsze `"Duży"`
- Powód: Booksy nie pokazuje obu terapeutek, wybór następuje później we frontend

### 2. Szybka rezerwacja (bez klienta)

Gdy zdjęcie pokazuje "Szybka rezerwacja" bez danych klienta:
- `customer.customerId` = `null`
- `customer.isNew` = `false`
- `customer.data` = `null`

### 3. Voucher/rabat

Gdy klient użył vouchera:
- `price` = pełna cena przed rabatem
- `voucherAmount` = wartość rabatu
- Kwota do zapłaty = `price - voucherAmount` (obliczane frontend)

---

## Błędy

### 400 Bad Request - Brak obrazu

```json
{
  "success": false,
  "error": "NO_IMAGE",
  "message": "Brak obrazu"
}
```

### 400 Bad Request - Błąd parsowania Claude

```json
{
  "success": false,
  "error": "CLAUDE_PARSE_ERROR",
  "message": "Zdjęcie przedstawia pole uprawne, nie jest to zrzut ekranu z aplikacji Booksy"
}
```

Występuje gdy:
- Obraz nie jest z aplikacji Booksy
- Nieznana usługa (nie ma w menu)
- Nieznany terapeuta
- Status "ANULOWANO"

### 400 Bad Request - Błąd walidacji

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Dane rezerwacji są nieprawidłowe",
  "validationErrors": [
    "Brak daty rozpoczęcia (start)",
    "Nieprawidłowa cena (price)"
  ]
}
```

### 409 Conflict - Brak dostępnego pokoju

```json
{
  "success": false,
  "error": "NO_ROOM_AVAILABLE",
  "message": "Oba pokoje są zajęte w tym terminie",
  "conflicts": [
    {
      "roomName": "Mały",
      "conflictingBookings": [
        {
          "id": "xyz789",
          "menuItemName": "Tradycyjny masaż tajski",
          "start": "2025-12-28T19:00:00+01:00",
          "end": "2025-12-28T21:00:00+01:00"
        }
      ]
    },
    {
      "roomName": "Duży",
      "conflictingBookings": [...]
    }
  ]
}
```

**UWAGA:** Ten błąd oznacza, że w bazie Firestore już istnieją rezerwacje kolidujące czasowo. Frontend może:
- Pokazać konflikt użytkownikowi
- Pozwolić administratorowi wybrać czy nadpisać istniejącą rezerwację
- Zablokować zapis

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "INTERNAL_ERROR",
  "message": "Opis błędu"
}
```

---

## Przepływ użycia

1. **Frontend wysyła zrzut ekranu** do `/parseBooksy`
2. **Backend zwraca:**
   - Sukces → dane `booking` + `customer`
   - Błąd → komunikat i kod błędu
3. **Frontend decyduje:**
   - Czy zapisać do Firestore (na podstawie odpowiedzi i ostrzeżeń)
   - Czy pokazać konflikt pokoi
   - Czy pozwolić na nadpisanie duplikatu

---

## Format dat ISO 8601

Wszystkie daty są w formacie ISO 8601 ze strefą czasową:
```json
"start": "2024-12-08T19:30:00+01:00",
"createdAt": "2025-01-14T12:29:45.456Z"
```

Frontend może je bezpośrednio zapisać do Firestore jako stringi lub przekonwertować:
```javascript
const date = new Date("2024-12-08T19:30:00+01:00");
```

