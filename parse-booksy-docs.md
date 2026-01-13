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
      "start": {
        "_seconds": 1733689800,
        "_nanoseconds": 0
      },
      "end": {
        "_seconds": 1733695200,
        "_nanoseconds": 0
      },
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
      "roomName": "Mały",
      "allocationReason": "default",
      "createdAt": {
        "_seconds": 1768325785,
        "_nanoseconds": 456000000
      }
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
| start | Timestamp | Data i czas rozpoczęcia wizyty (Firestore Timestamp) |
| end | Timestamp | Data i czas zakończenia wizyty (Firestore Timestamp) |
| menuItemName | string | Nazwa usługi z menu |
| services | array | Tablica zabiegów z przypisanymi terapeutami |
| services[].treatment | string | Nazwa zabiegu |
| services[].therapist | string | Imię terapeuty (Daisy, Kara, Emma, Cream) |
| price | number | Cena zabiegu w złotych |
| voucherAmount | number | Wartość użytego vouchera/rabatu w złotych (0 jeśli brak) |
| status | string | Status rezerwacji: `"confirmed"` lub `"noshow"` |
| roomId | string | ID pokoju z Firestore |
| roomName | string | Nazwa pokoju: `"Mały"` lub `"Duży"` |
| allocationReason | string | Powód przydziału pokoju: `"default"`, `"couples_massage"`, `"fallback_small_occupied"` |
| createdAt | Timestamp | Timestamp utworzenia rekordu |

### Struktura danych: `customer`

| Pole | Typ | Opis |
|------|-----|------|
| customerId | string\|null | Znormalizowany numer telefonu (bez spacji) lub `null` dla szybkiej rezerwacji |
| isNew | boolean | `true` jeśli klient nie istnieje w bazie, `false` jeśli istnieje |
| data | object\|null | Dane klienta lub `null` dla szybkiej rezerwacji |
| data.firstName | string | Imię klienta |
| data.lastName | string | Nazwisko klienta |
| data.createdAt | string\|Timestamp | Data utworzenia klienta w bazie |

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

## Firestore Timestamp

Pola typu Firestore Timestamp mają format:
```json
{
  "_seconds": 1733689800,
  "_nanoseconds": 0
}
```

Frontend może je bezpośrednio zapisać do Firestore lub przekonwertować używając Firebase SDK:
```javascript
import { Timestamp } from 'firebase/firestore';

const timestamp = new Timestamp(data._seconds, data._nanoseconds);
```

---

## Uwagi implementacyjne

1. **Funkcja NIE zapisuje do bazy** - tylko zwraca dane
2. **Frontend jest odpowiedzialny za:**
   - Zapis do kolekcji `bookings`
   - Zapis nowego klienta do kolekcji `customers` (jeśli `isNew: true`)
   - Obsługę konfliktów pokoi
   - Obsługę duplikatów
   - Obsługę wyboru terapeutek dla masażu dla dwojga
3. **Alokacja pokoi jest sugestią** - frontend może ją zmienić
4. **Status 409 (konflikt pokoi) nie blokuje** - to informacja, frontend decyduje

---

## Dozwolone wartości

### Usługi (menuItemName)

- Thairapy Deep Relax - masaż autorski
- Tajski masaż olejkiem
- Tradycyjny masaż tajski
- Tajski masaż stóp i ramion
- Masaż pleców - Zdrowy kręgosłup
- Masaż olejkami aromatycznymi
- Masaż gorącym olejkiem
- Masaż gorącymi kamieniami
- Masaż stemplami ziołowymi
- Masaż dla dwojga

### Terapeuci (services[].therapist)

- Daisy
- Kara
- Emma
- Cream

### Statusy (status)

- `confirmed` - wizyta potwierdzona/zakończona
- `noshow` - klient się nie stawił

### Pokoje (roomName)

- `Mały` - jeden stół, masaże indywidualne
- `Duży` - dwa stoły, masaż dla par
