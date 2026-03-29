# Architektura techniczna — Protokół Urodzinowy

## 1. Przegląd

Aplikacja jest celowo **monolitycznym, jednolikowym plikiem HTML**. Decyzja ta jest świadoma i uzasadniona w ADR-001. Cały kod (markup, style, logika) żyje w `index.html`.

```
index.html
├── <style>          CSS (ok. 600 linii)
├── <body>           HTML — ekrany i overlaye
└── <script>         JavaScript (ok. 1000 linii)
    ├── CONFIG       konfiguracja
    ├── Dane         pytania, treści, definicje misji
    ├── State        stan gry
    ├── Audio        Web Audio API
    ├── Screens      zarządzanie ekranami
    ├── Misje 1–5    logika każdej misji
    ├── Overlaye     modal: sukces, game over
    └── Boot         sekwencja startowa
```

---

## 2. Moduły (logiczne, w jednym pliku)

### 2.1 CONFIG

Jedyny punkt konfiguracji gry. Zawiera wszystko co rodzic musi ustawić. Nie zawiera logiki — tylko dane.

```js
const CONFIG = { agentName, agentAge, missionCodes, fieldCode, fieldClue }
```

**Zasada:** żadna wartość zależna od konkretnego urodzinowca nie pojawia się poza CONFIG.

### 2.2 Dane statyczne

Stałe tablice z treścią gry — pytania quizowe, zadania matematyczne, emoji do memory. Nie są częścią CONFIG ponieważ są wspólne dla wszystkich edycji gry.

```js
const QUIZ_QUESTIONS = [...]
const MATH_QUESTIONS = [...]
const MEMORY_EMOJIS  = [...]
const MISSIONS_DATA  = [...]
```

### 2.3 State (`G`)

Minimalny globalny stan aplikacji.

```js
const G = {
  completed: new Set([...JSON.parse(localStorage.getItem("pb_done") || "[]")])
}
```

Stan jest synchronizowany z `localStorage` przy każdej zmianie przez `saveState()`.

**Zasada:** stan zmieniamy tylko przez dedykowane funkcje, nigdy bezpośrednio z logiki misji.

### 2.4 Audio

Wrapper na Web Audio API. Eksponuje obiekt `SFX` z nazwanymi efektami:

```js
SFX.click()   SFX.correct()   SFX.wrong()
SFX.unlock()  SFX.victory()   SFX.tap()
```

AudioContext jest tworzony lazy (przy pierwszej interakcji użytkownika) żeby uniknąć błędów autoplay policy przeglądarek.

### 2.5 Screen Manager

Prosty router ekranów oparty o CSS class `active`.

```js
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"))
  document.getElementById(id).classList.add("active")
}

function goToMissions() { buildMissionGrid(); showScreen("screen-missions") }
```

Każdy ekran to `<div class="screen" id="screen-X">`. Jeden aktywny naraz.

### 2.6 Logika misji

Każda misja ma trzy funkcje:

```
init[NazwaMisji]()    ← reset stanu misji, render UI
[gra]()               ← logika wewnętrzna (może być kilka funkcji)
completeMission(id)   ← wywołane po sukcesie → aktualizuje G, pokazuje overlay
```

Misje komunikują się z resztą aplikacji **wyłącznie** przez `completeMission(id)` i `showGameover(msg, retryFn)`. Nie modyfikują bezpośrednio stanu globalnego.

### 2.7 Overlaye

Dwa overlaye (modal dialogi): sukces misji i game over. Kontrolowane przez:

```js
showMissionComplete(id)    // sukces → wyświetla kod fragmentu, konfetti
showGameover(msg, retryFn) // porażka → message + opcja retry
closeOverlays()            // zamyka wszystkie
```

---

## 3. Cykl życia misji

```
launchMission(id)
    │
    ├─ initMisja()     ← reset UI, reset stanu lokalnego misji
    │
    ├─ showScreen()    ← przełącz widok
    │
    ├─ [interakcja użytkownika]
    │
    ├─ sukces → completeMission(id)
    │               │
    │               ├─ G.completed.add(id)
    │               ├─ saveState()
    │               └─ showMissionComplete(id) → overlay → goToMissions()
    │
    └─ porażka → showGameover(msg, retryFn)
```

---

## 4. Persystencja

```
[G.completed] ←→ saveState() / loadState() ←→ localStorage["pb_done"]
```

Tylko lista ID zaliczonych misji jest persystowana. Pozostały stan (bieżące pytanie, wyniki tymczasowe) jest lokalny dla misji i resetuje się przy każdym `init`.

---

## 5. Drzewo ekranów

```
screen-boot
    └── screen-briefing
            └── screen-missions (hub)
                    ├── screen-mission1 (quiz)
                    ├── screen-mission2 (math)
                    ├── screen-mission3 (reflex)
                    ├── screen-mission4 (memory)
                    ├── screen-mission5 (field)
                    └── screen-vault
                            └── screen-success
```

Overlaye (`ov-complete`, `ov-gameover`) są niezależne od drzewa ekranów — nakładają się na dowolny aktywny ekran.

---

## 6. Granica między frontendem a przyszłym backendem

**Teraz:** CONFIG + localStorage → wszystko po stronie przeglądarki.

**Przyszłość:** CONFIG zostanie zastąpione przez API call, localStorage przez session token + backend DB. Granica jest celowo wyraźna: cały kod gry (misje, UI, audio) nie wie nic o tym skąd pochodzi konfiguracja.

```js
// Teraz (hardcoded):
const CONFIG = { agentName: "KUBA", ... }

// Przyszłość (API):
const CONFIG = await fetch("/api/session/abc123").then(r => r.json())
// Reszta kodu gry NIE zmienia się
```

Ta granica pozwala dodać backend bez refaktoryzacji logiki gry.

---

## 7. Konwencje kodu

**Nazewnictwo:**
- Funkcje: camelCase (`initQuiz`, `handleAnswer`, `goToMissions`)
- Stałe globalne: UPPER_SNAKE (`QUIZ_QUESTIONS`, `CONFIG`)
- Stan misji lokalny: skrótowy inicjał + obiekt (`QS`, `MS`, `RS`, `MEM`)
- ID ekranów: kebab-case z prefiksem (`screen-mission1`, `ov-complete`)

**Zasady:**
- Żadnego `document.write()`
- Eventy przez `addEventListener`, nie atrybuty HTML `onclick=` (z wyjątkami legacy w HTML dla czytelności)
- Wszystkie timeouty czyszczone przy `init` misji (brak memory leaks)
- Dźwięki zawsze w `try/catch` (przeglądarka może zablokować audio)
