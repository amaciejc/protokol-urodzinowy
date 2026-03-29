# Personalizacja — nowe dziecko, nowa okazja

Instrukcja jak dostosować grę dla konkretnego dziecka i konkretnych urodzin. Nie wymaga znajomości programowania — wystarczy edycja pliku tekstowego.

---

## Minimalna personalizacja (10 minut)

Otwórz `index.html` w edytorze tekstu (Notatnik, TextEdit, VS Code) i znajdź sekcję `CONFIG` (jest na początku bloku `<script>`):

```js
const CONFIG = {
  agentName:    "KUBA",        // ← zmień na imię dziecka
  agentAge:     9,             // ← zmień na wiek
  missionCodes: ["KU","BA","07","XY","ZZ"],  // ← zmień kody
  fieldCode:    "AGENT",       // ← zmień kod terenowy
  fieldClue:    `...`,         // ← zmień zagadkę terenową
}
```

To wystarczy żeby gra działała dla innego dziecka.

---

## Parametry konfiguracyjne — opis

### `agentName`

Imię dziecka. Pojawia się w boot screen, briefingu, tytule agenta, gratulacjach.

```js
agentName: "ZUZIA"
agentName: "MAKSYMILIAN"
agentName: "ANIA"
```

### `agentAge`

Wiek dziecka. Pojawia się w briefingu i parametrach misji.

```js
agentAge: 7
agentAge: 12
```

### `missionCodes`

Tablica 5 (lub więcej) fragmentów kodu. Każdy fragment pojawia się po zaliczeniu odpowiedniej misji. Złożone razem tworzą master kod.

**Zasady:**
- Każdy fragment: 2–4 znaki (litery i/lub cyfry)
- Nie używaj spacji ani polskich znaków
- Master kod = fragmenty sklejone bez spacji

```js
// Przykłady:
missionCodes: ["AN", "IA", "20", "25", "XO"]   // master: ANIA2025XO
missionCodes: ["07", "07", "20", "25", "!!"]   // master: 07072025!!
missionCodes: ["ZU", "ZI", "A9", "LA", "T!"]  // master: ZUZIA9LAT!
```

**Wskazówka:** możesz zbudować master kod który coś znaczy, np. datę urodzin, inicjały + wiek, imię:

```js
// "ZUZIA9" → ZU + ZI + A9
missionCodes: ["ZU", "ZI", "A9", "KO", "D!"]
```

### `fieldCode`

Tajne słowo/liczba wpisana na karteczce którą rodzic ukrywa w fizycznym miejscu. Dziecko wpisuje je do gry w Misji 5.

```js
fieldCode: "SKARB"
fieldCode: "MAMA"
fieldCode: "2025"
fieldCode: "ROWER"    // podpowiedź: może to być prezent?
```

**Ważne:** po urodzinach zmień ten kod jeśli gra jest publicznie hostowana.

### `fieldClue`

Tekst zagadki wyświetlany dziecku w Misji 5, opisujący gdzie szukać karteczki. Formatuj jak chcesz — nowe linie z `\n`, emoji OK.

```js
fieldClue: `🔍 UWAGA AGENT ZUZIA! 🔍

Twoja misja terenowa przenosi Cię
do miejsca, gdzie rosną Twoje skarby.

Sprawdź pod najgrubszą książką
na Twoim biurku.

Znajdź kopertę i wpisz kod!`,
```

**Pomysły na ukrycia:**
- Pod poduszką
- W lodówce za jogurtami
- W kieszeni ulubionej kurtki
- Przyklejona pod stołem
- W pudełku z Lego
- Wewnątrz konkretnej książki (podaj tytuł w zagadce)
- U babci / u wujka (jeśli impreza u kogoś)

---

## Personalizacja pytań quizowych

Pytania quizowe są w tablicy `QUIZ_QUESTIONS`. Możesz:
- Dodać własne pytania (wklej nowy obiekt do tablicy)
- Usunąć kategorie (np. wyciąć piłkę nożną jeśli dziecko nie lubi)
- Zmienić całą tematykę (Roblox → Harry Potter)

**Format pytania:**

```js
{
  q:   "Treść pytania?",
  ans: ["Odpowiedź A", "Odpowiedź B", "Odpowiedź C", "Odpowiedź D"],
  ok:  2,          // indeks poprawnej odpowiedzi (0=A, 1=B, 2=C, 3=D)
  tag: "⚡ Harry Potter",  // etykieta kategorii (wyświetlana nad pytaniem)
}
```

**Przykład — Harry Potter:**

```js
{
  q:   "Jak się nazywa szkoła magii do której uczęszcza Harry Potter?",
  ans: ["Beauxbatons", "Durmstrang", "Hogwart", "Ilvermorny"],
  ok:  2,
  tag: "⚡ Harry Potter",
},
{
  q:   "Jaki sport uprawia się na miotłach w świecie Harry'ego Pottera?",
  ans: ["Quodpot", "Quidditch", "Bezbat", "Goldballs"],
  ok:  1,
  tag: "⚡ Harry Potter",
},
```

---

## Checklist przed urodzinami

### 1 tydzień przed

- [ ] Zmień `agentName` i `agentAge` w CONFIG
- [ ] Wymyśl 5 kodów misji i wpisz do `missionCodes`
- [ ] Wymyśl `fieldCode` — jedno słowo które wpiszesz na karteczce
- [ ] Napisz `fieldClue` — zagadkę opisującą gdzie ukryta karteczka
- [ ] Dostosuj pytania quizowe do zainteresowań dziecka
- [ ] Przetestuj całą grę od początku do końca

### Dzień przed

- [ ] Wydrukuj lub napisz odręcznie karteczkę z `fieldCode`
- [ ] Ukryj karteczkę w miejscu opisanym w `fieldClue`
- [ ] Wgraj zaktualizowaną grę na GitHub Pages (lub przygotuj tablet offline)
- [ ] Zapamiętaj master kod (lub zapisz go dla siebie: CONFIG.missionCodes.join(""))
- [ ] Naładuj tablet

### W dniu urodzin

- [ ] Uruchom grę, pokaż dziecku ekran startowy
- [ ] Bądź blisko podczas Misji 5 (terenowej) — dziecko idzie szukać karteczki
- [ ] Gdy pojawi się master kod — odbierz go i przygotuj prezenty

---

## Wiele edycji / wiele dzieci

Jeśli organizujesz urodziny dla wielu dzieci lub chcesz prowadzić bibliotekę edycji:

Trzymaj każdą edycję jako osobny plik z sufiksem:
```
index.html           ← aktualna edycja (do deploymentu)
archive/
  kuba-2025.html     ← archiwum: Kuba, 9 lat, 2025
  zuzia-2024.html    ← archiwum: Zuzia, 8 lat, 2024
```

Albo jako osobne repo / branch na GitHubie:
```
main                 ← aktualna edycja
branch: kuba-2025    ← Kuba, archiwum
branch: zuzia-2024   ← Zuzia, archiwum
```

---

## Okazje inne niż urodziny

Gra nie jest limitowana do urodzin — można ją dostosować do:

**Mikołajki:** zmień narrację w `briefingText` na "misja mikołajkowa", zamień `agentAge` na "poziom grzeczności" 😄

**Wielkanoc:** zmień `fieldClue` na szukanie jajek, `MISSIONS_DATA` może zawierać misję "znajdź ukryte jajko numer X"

**Imieniny, Dzień Dziecka:** zmień kopię narracyjną w boot screen i briefingu

Aby zmienić narrację boot screenu — edytuj tablicę `BOOT_LINES` w JS. Aby zmienić tekst briefingu — edytuj ciąg w wywołaniu `typeText(...)`.
