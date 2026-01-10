---
applyTo: "**"
---

# Schemat bazy danych Firestore

Dokumentów przeanalizowanych: 921

Wygenerowano: 2026-01-09 23:30:22

## bookings (622 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| addons | array | 100% | tablica |
| addonsPrice | number | 98% | 0-0 |
| allocationReason | string | 0% | default, fallback_small_occupied |
| createdAt | timestamp | 100% | - |
| customerId | string | 100% | 235 unikalnych |
| email | null | 0% | - |
| end | timestamp | 100% | - |
| externalId | string | 98% | 607 unikalnych |
| firstName | string | 0% | Agnieszka, Phel |
| lastName | string | 0% | Jurek, Utov |
| menuItemName | string | 100% | 18 unikalnych |
| phone | string | 0% | 604 897 437, 501 819 504 |
| price | number | 100% | 150-560 |
| roomId | string | 100% | lvB1qNXaCvHolapBglFT, c64PIrPciFhzlIOP7bzI |
| roomName | string | 0% | Mały, Duży |
| services | array | 100% | tablica |
| services[].therapist | string | 100% | Kara, Daisy |
| services[].treatment | string | 100% | 17 unikalnych |
| source | string | 98% | import |
| start | timestamp | 100% | - |
| status | string | 100% | cancelled, completed, noshow, confirmed |
| voucherAmount | number | 100% | 0-180 |

## customers (237 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| address | string | 6% |  |
| allergies | string | 6% |  |
| birthday | string | 6% |  |
| createdAt | timestamp | 100% | - |
| dataProcessingConsent | boolean | 6% | - |
| discount | number | 6% | 0-0 |
| email | string | 100% |  |
| firstName | string | 100% | 129 unikalnych |
| lastName | string | 100% | 205 unikalnych |
| marketingConsent | boolean | 100% | - |
| nip | string | 6% |  |
| notes | string | 100% |  |
| phone | string | 100% | 205 unikalnych |
| source | string | 94% | Ręczny, Booksy, Unknown |
| trusted | boolean | 100% | - |

## menu (10 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| name | string | 100% | Masaż olejkami aromatycznymi, Tajski masaż stóp i ramion, Tradycyjny masaż tajski, Masaż dla dwojga, Masaż pleców - Zdrowy kręgosłup, Thairapy Deep Relax - masaż autorski, Masaż gorącymi kamieniami, Tajski masaż olejkiem, Masaż stemplami ziołowymi, Masaż gorącym olejkiem |
| variants | array | 100% | tablica |
| variants[].duration | number | 100% | 60-90 |
| variants[].price | number | 100% | 180-360 |

## rooms (2 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| allowsCouples | boolean | 100% | - |
| name | string | 100% | Duży, Mały |

## test (1 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| message | string | 100% | Hello from Thairapy! |
| timestamp | timestamp | 100% | - |

## therapistDaysOff (47 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| createdAt | object | 100% | - |
| date | string | 100% | 43 unikalnych |
| reason | string | 100% | urlop, dzień wolny |
| therapist | string | 100% | Kara, Daisy |

## therapists (2 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| createdAt | object | 100% | - |
| defaultWorkHours | object | 100% | - |
| name | string | 100% | Daisy, Kara |
| weeklyDaysOff | number | 100% | 1-1 |

