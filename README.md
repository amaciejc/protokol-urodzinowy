# 🎂 Protokół Urodzinowy

Interaktywna gra urodzinowa w klimacie agencji szpiegowskiej.
Dziecko przechodzi przez misje, i zbiera kody, które potem może wymienić na prezenty lub nagrody. Może też zbierać fragmenty jednego, tajnego kodu, który odblokowuje wszystkie prezenty.

**Technologia:** czysty HTML + CSS + JS (zero frameworków, zero zależności)
**Optymalizacja:** tablet (touch-friendly, duże przyciski)
**Język:** polski
**Aktualny bohater:** Agent Kuba, 9 lat

---

## Szybki start

1. Otwórz `index.html` w przeglądarce — gra gotowa
2. Dostosuj `CONFIG` na górze pliku JS do swoich potrzeb
3. Napisz kod terenowy na karteczce i ukryj w fizycznym miejscu
4. Wrzuć na GitHub Pages (patrz [`docs/04-deployment.md`](docs/04-deployment.md))

---

## Struktura projektu

```
protokol-urodzinowy/
├── index.html                   ← cała gra (HTML + CSS + JS)
├── README.md                    ← ten plik
└── docs/
    ├── 01-wymagania.md          ← jak gra działa (wymagania funkcjonalne)
    ├── 02-architektura.md       ← budowa techniczna aplikacji
    ├── 03-adr.md                ← decyzje architektoniczne + ścieżka do płatności
    ├── 04-deployment.md         ← jak wrzucić na GitHub Pages
    ├── 05-nowe-misje.md         ← jak dodać nową misję do gry
    └── 06-personalizacja.md     ← jak dostosować grę dla innego dziecka
```

---

## Demo

> Gra dostępna pod: *[uzupełnij po wdrożeniu na GitHub Pages]*

---

## Dokumentacja

| Dokument | Opis |
|---|---|
| [Wymagania](docs/01-wymagania.md) | Co robi gra, jak wygląda flow, zasady misji |
| [Architektura](docs/02-architektura.md) | Jak jest zbudowana, moduły, state, eventy |
| [Decyzje (ADR)](docs/03-adr.md) | Dlaczego vanilla JS, ścieżka do płatności |
| [Deployment](docs/04-deployment.md) | Krok po kroku: GitHub Pages |
| [Nowe misje](docs/05-nowe-misje.md) | Kontrakt misji, przykład, checklist |
| [Personalizacja](docs/06-personalizacja.md) | Jak zmienić bohatera, misje, kody |
| [OgólnyScenariusz misji] (docs/07-scenariusz.md) | Jak wygląda cały proces zabawy, od zaproszenia do gry, przez wszystkie fizyczne i cyfrowe elementy |

---

## Tryb rodzicielski

Naciśnij napis **AGENT: KUBA** 5 razy na ekranie briefingu — zobaczysz wszystkie kody misji i kod terenowy do wpisania na karteczce.

---

## Status projektu

- [x] MVP — 5 misji, animacje, dźwięki, localStorage
- [ ] Podstrona administracyjna dla rodziców (generator gry)
- [ ] Integracja płatności (Stripe)
- [ ] Baza danych wyników (Supabase)
- [ ] Tryb multiplayer (kilkoro dzieci, wspólny skarbiec)
