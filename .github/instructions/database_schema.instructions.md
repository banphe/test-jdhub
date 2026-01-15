---
applyTo: "**"
---

# Schemat bazy danych Firestore

Dokumentów przeanalizowanych: 909

Wygenerowano: 2026-01-12 16:27:39

## bookings (621 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| allocationReason | string | 0% | default, fallback_small_occupied |
| createdAt | timestamp | 100% | - |
| customerPhone | string | 73% | 226 unikalnych |
| end | timestamp | 100% | - |
| externalId | string | 98% | 605 unikalnych |
| menuItemName | string | 100% | Thairapy Deep Relax - masaż autorski, Masaż dla dwojga, Tradycyjny masaż tajski, Masaż stemplami ziołowymi, Tajski masaż olejkiem, Masaż gorącymi kamieniami, Masaż pleców - Zdrowy kręgosłup, Masaż olejkami aromatycznymi, Masaż gorącym olejkiem, Tajski masaż stóp i ramion |
| price | number | 100% | 150-560 |
| roomId | string | 100% | lvB1qNXaCvHolapBglFT, c64PIrPciFhzlIOP7bzI |
| services | array | 100% | tablica |
| services[].therapist | string | 100% | Kara, Daisy |
| services[].treatment | string | 100% | Thairapy Deep Relax - masaż autorski, Tradycyjny masaż tajski, Masaż stemplami ziołowymi, Tajski masaż olejkiem, Masaż gorącymi kamieniami, Masaż pleców - Zdrowy kręgosłup, Masaż olejkami aromatycznymi, Masaż gorącym olejkiem, Tajski masaż stóp i ramion |
| start | timestamp | 100% | - |
| status | string | 100% | cancelled, confirmed, noshow |
| voucherAmount | number | 100% | 0-180 |

## customers (227 dokumentów)

| Pole | Typ | Obecność | Wartości |
|------|-----|----------|----------|
| createdAt | timestamp | 100% | - |
| firstName | string | 100% | 125 unikalnych |
| lastName | string | 100% | 200 unikalnych |

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

