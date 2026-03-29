# Jak dodać nową misję

Instrukcja dla programisty lub zaawansowanego rodzica chcącego rozszerzyć grę o dodatkowe misje.

---

## Kontrakt misji

Każda misja musi implementować trzy elementy:

```js
// 1. Ekran HTML (w <body>)
<div class="screen" id="screen-mission6">
  <!-- UI misji -->
</div>

// 2. Inicjalizacja (reset stanu, render UI)
function initMisja6() {
  // Reset wszystkich zmiennych stanu misji
  // Wyrenderuj UI od zera
}

// 3. Rejestracja w launchMission()
case 6: initMisja6(); showScreen("screen-mission6"); break;
```

Misja **musi** zakończyć się wywołaniem jednej z dwóch funkcji:

```js
completeMission(6)           // sukces → fragment kodu, confetti, powrót do hub
showGameover(msg, retryFn)   // porażka → overlay z opcją retry
```

Misja **nie może** bezpośrednio modyfikować `G` (globalny stan) — robi to `completeMission()`.

---

## Krok po kroku — przykład: Misja 6 "Szyfr Cezara"

### Krok 1 — Dodaj kod fragmentu do CONFIG

```js
const CONFIG = {
  // ...
  missionCodes: ["KU", "BA", "07", "XY", "ZZ", "AG"],  // ← dodaj 6. element
}
```

### Krok 2 — Dodaj definicję do MISSIONS_DATA

```js
const MISSIONS_DATA = [
  // ... istniejące ...
  { id:6, name:"Szyfr Cezara", icon:"🔐", desc:"Rozszyfruj wiadomość", screen:"screen-mission6" },
]
```

### Krok 3 — Dodaj HTML ekranu

Wklej przed zamykającym `</body>`, po ostatnim ekranie misji:

```html
<div class="screen" id="screen-mission6">
  <div class="screen-inner">

    <div class="mission-header">
      <div class="label">MISJA 06 // SZYFR CEZARA</div>
      <h2>Rozszyfruj Wiadomość</h2>
    </div>

    <div class="question-box" id="cipher-question">
      <!-- Zaszyfrowany tekst pojawi się tutaj -->
    </div>

    <div class="numpad-display" id="cipher-display">_</div>

    <!-- Klawiatura lub własny input -->

    <div class="feedback-line" id="cipher-feedback"></div>

    <button class="btn" onclick="checkCipher()">SPRAWDŹ</button>
    <button class="btn btn-red btn-sm" onclick="goToMissions()">WRÓĆ DO BAZY</button>

  </div>
</div>
```

### Krok 4 — Dodaj logikę JS

```js
// ============================================================
// MISSION 6 — SZYFR CEZARA
// ============================================================
const CIPHER_PUZZLES = [
  { encrypted: "NRMFDBSBGU", shift: 3, answer: "KJICAXYPDR" },  // przykład
  // ... więcej zagadek
]

let CS = {}  // cipher state

function initMisja6() {
  CS = { cur: 0, input: "" }
  showCipherQuestion()
}

function showCipherQuestion() {
  const puzzle = CIPHER_PUZZLES[CS.cur]
  document.getElementById("cipher-question").textContent =
    `Szyfr Cezara (przesunięcie: ${puzzle.shift}):\n\n${puzzle.encrypted}`
  document.getElementById("cipher-display").textContent = "_"
  document.getElementById("cipher-feedback").textContent = ""
  CS.input = ""
}

function checkCipher() {
  const puzzle = CIPHER_PUZZLES[CS.cur]
  if (CS.input.toUpperCase() === puzzle.answer) {
    SFX.correct()
    CS.cur++
    if (CS.cur >= CIPHER_PUZZLES.length) {
      completeMission(6)  // ← KONIEC MISJI
    } else {
      showCipherQuestion()
    }
  } else {
    SFX.wrong()
    document.getElementById("cipher-feedback").innerHTML =
      '<span style="color:var(--red)">✗ Spróbuj jeszcze raz!</span>'
  }
}
```

### Krok 5 — Zarejestruj w launchMission()

```js
function launchMission(id) {
  switch(id) {
    case 1: initQuiz();   showScreen("screen-mission1"); break;
    // ...
    case 5: initField();  showScreen("screen-mission5"); break;
    case 6: initMisja6(); showScreen("screen-mission6"); break;  // ← dodaj
  }
}
```

### Krok 6 — Zaktualizuj progress bar

Jeśli zmienisz liczbę misji z 5 na 6, zaktualizuj jeden fragment w `buildMissionGrid()`:

```js
// Zmień:
document.getElementById("btn-go-vault").style.display = done >= 5 ? "flex" : "none"
// Na:
document.getElementById("btn-go-vault").style.display = done >= 6 ? "flex" : "none"
```

I w progress text:
```js
// Zmień:
document.getElementById("progress-text").textContent = `${done} / 5`
document.getElementById("progress-fill").style.width = `${done/5*100}%`
// Na:
document.getElementById("progress-text").textContent = `${done} / 6`
document.getElementById("progress-fill").style.width = `${done/6*100}%`
```

---

## Typy misji — wzorce do ponownego użycia

### Typ: Quiz (wybór odpowiedzi)

Wzorzec z Misji 1. Dobre do: quizów wiedzy, zagadek "który to Minecraft mob", rozpoznawania piłkarzy.

### Typ: Input numeryczny (numpad)

Wzorzec z Misji 2. Dobre do: matematyki, szyfru liczbowego, "ile kroków do skarbu".

### Typ: Click target

Wzorzec z Misji 3. Dobre do: testu refleksów, "kliknij wszystkie jabłka", "znajdź ukrytego agenta".

### Typ: Memory / Matching

Wzorzec z Misji 4. Dobre do: dopasowania flag-kraj, emoji-słowo, parowania rekordów sportowych.

### Typ: Input tekstowy

Wzorzec z Misji 5. Dobre do: kodów z karteczek, rozwiązania zagadki (jedno słowo), szyfru Cezara.

### Typ: Drag & Drop (do zaimplementowania)

Brak w MVP. Dobre do: ułożenia puzzle, posortowania krajów według populacji, ułożenia fragmentów mapy.

---

## Checklist przed wdrożeniem nowej misji

- [ ] Dodałem kod fragmentu do `CONFIG.missionCodes`
- [ ] Dodałem wpis do `MISSIONS_DATA`
- [ ] Ekran HTML ma `id="screen-missionX"`
- [ ] `initMisjaX()` resetuje **cały** stan misji (nie zakłada poprzedniego stanu)
- [ ] Misja wywołuje `completeMission(X)` przy sukcesie
- [ ] Misja wywołuje `showGameover()` przy porażce (jeśli dotyczy)
- [ ] `launchMission()` ma nowy `case X:`
- [ ] Zaktualizowałem liczby `/5` → `/6` w `buildMissionGrid()`
- [ ] Przetestowałem misję: przejście, porażka+retry, powrót do bazy w trakcie
- [ ] Przetestowałem cały flow: od boot do skarbca z nową misją
