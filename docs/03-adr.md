# Architecture Decision Records (ADR)

Dokument rejestruje kluczowe decyzje architektoniczne: co wybraliśmy, dlaczego i jakie są konsekwencje. Każda decyzja ma status: **Aktywna** / **Zastąpiona** / **Wycofana**.

---

## ADR-001 — Vanilla JS, zero frameworków

**Status:** Aktywna

**Kontekst:**
Gra urodzinowa uruchamiana na tablecie, prawdopodobnie bez internetu. Musi działać jako jeden plik HTML pobrany lub wysłany przez WhatsApp.

**Decyzja:**
Budujemy w czystym HTML + CSS + JavaScript. Bez React, Vue, Svelte, jQuery, ani żadnych zewnętrznych zależności.

**Konsekwencje pozytywne:**
- Aplikacja działa offline natychmiast po pobraniu pliku
- Zero problemów z zależnościami (npm install, wersje, konflikty)
- Czas ładowania < 1 sekunda (plik ~64KB)
- Każdy może edytować plik bez znajomości ekosystemu Node
- Hostowanie: wystarczy dowolny static hosting, nawet Dropbox

**Konsekwencje negatywne:**
- Brak reactivity (manualne odświeżanie UI przez funkcje `render*()`)
- Brak systemu modułów (wszystko w jednym scope globalnym)
- Trudniejsze testowanie jednostkowe

**Kiedy warto zrewidować:**
Gdy liczba misji przekroczy 10 i plik JS urośnie powyżej ~500KB, lub gdy pojawi się potrzeba współdzielenia kodu między wieloma "edycjami" gry.

---

## ADR-002 — Jeden plik HTML

**Status:** Aktywna

**Kontekst:**
Gra musi być łatwa do dystrybucji (WhatsApp, email, pendrive) i uruchamiania (otwórz w przeglądarce).

**Decyzja:**
Cały kod (HTML, CSS, JS) w jednym pliku `index.html`.

**Konsekwencje pozytywne:**
- Dystrybucja = jeden plik
- Brak problemów z CORS (ładowanie zasobów)
- Działa po podwójnym kliknięciu w Explorerze / Finderze

**Konsekwencje negatywne:**
- Plik rośnie do ~2000+ linii — trudniejszy code review
- Brak code splitting

**Kiedy warto zrewidować:**
Gdy dodamy zasoby (obrazki, dźwięki jako pliki audio) — wtedy naturalnie przechodzimy do folderu z podplikami.

---

## ADR-003 — localStorage jako storage

**Status:** Aktywna (tymczasowa)

**Kontekst:**
Postęp gracza musi przeżywać odświeżenie strony i uśpienie tabletu.

**Decyzja:**
Persystujemy tylko listę zaliczonych misji (`pb_done`) w `localStorage`.

**Konsekwencje pozytywne:**
- Działa bez backendu
- Zero konfiguracji
- Natychmiastowe odczyty/zapisy

**Konsekwencje negatywne:**
- Dane znikają po wyczyszczeniu cache
- Brak synchronizacji między urządzeniami
- Brak historii / analityki

**Ścieżka migracji do backendu:**
```
// Teraz:
saveState()   → localStorage.setItem("pb_done", JSON.stringify([...G.completed]))
loadState()   → JSON.parse(localStorage.getItem("pb_done") || "[]")

// Po migracji (tylko te dwie funkcje się zmieniają):
saveState()   → await fetch("/api/progress", { method: "POST", body: ... })
loadState()   → await fetch("/api/progress/" + sessionId).then(r => r.json())
```

Reszta gry nie wymaga zmian.

---

## ADR-004 — Web Audio API (brak plików audio)

**Status:** Aktywna

**Kontekst:**
Gra potrzebuje efektów dźwiękowych. Pliki MP3/WAV komplikują dystrybucję.

**Decyzja:**
Wszystkie dźwięki generowane programatycznie przez Web Audio API (oscylatory, obwiednia ADSR).

**Konsekwencje pozytywne:**
- Brak zewnętrznych plików
- Pełna kontrola programatyczna
- Działa offline

**Konsekwencje negatywne:**
- Ograniczona jakość dźwięku (tylko synteza)
- Brak muzyki tła, narracji głosowej

**Kiedy warto zrewidować:**
Gdy pojawi się potrzeba lektora (accessibility) lub muzyki tła — wtedy przechodzimy na pliki audio base64-encoded w pliku HTML lub zewnętrzne pliki w folderze `/assets`.

---

## ADR-005 — CONFIG jako jedyna granica konfiguracji

**Status:** Aktywna

**Kontekst:**
Gra ma być używana wielokrotnie dla różnych dzieci. Każda "edycja" różni się imieniem, wiekiem, kodami i treścią misji terenowej.

**Decyzja:**
Wszystkie wartości specyficzne dla konkretnego urodzinowca są zgrupowane w jednym obiekcie `CONFIG` na górze pliku JS. Logika gry nie zawiera żadnych hardkodowanych wartości personalnych.

```js
const CONFIG = {
  agentName:    "KUBA",
  agentAge:     9,
  missionCodes: ["KU","BA","07","XY","ZZ"],
  fieldCode:    "AGENT",
  fieldClue:    "...",
}
```

**Konsekwencje:**
- Nowa edycja = zmiana 5 wartości w jednym miejscu
- Prosty w przyszłości generator gry (frontend form → wypełnia CONFIG → pobierz plik)
- Czytelna granica między "danymi" a "kodem"

---

## ADR-006 — Ścieżka do płatności i backendu

**Status:** Planowana (nie zaimplementowana)

**Kontekst:**
Docelowo gra stanie się produktem SaaS — rodzic płaci, konfiguruje grę przez panel, dostaje link do uruchomienia.

**Decyzja:**
Architektura docelowa będzie wyglądać następująco. Gra (frontend) pozostaje statycznym plikiem. Backend obsługuje tylko konfigurację, sesje i płatności.

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (bez zmian)                               │
│  index.html — gra                                   │
│  CONFIG ← pobierany z API zamiast hardcoded         │
└───────────────┬─────────────────────────────────────┘
                │ fetch("/api/session/:id")
┌───────────────▼─────────────────────────────────────┐
│  BACKEND                                            │
│  /api/session/:id   → zwraca CONFIG dla sesji       │
│  /api/progress      → zapisuje postęp               │
│  /api/checkout      → Stripe checkout               │
└───────────────┬─────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────┐
│  BAZA DANYCH (Supabase / PostgreSQL)                │
│  sessions: id, config_json, created_at, paid        │
│  progress: session_id, mission_id, completed_at     │
└─────────────────────────────────────────────────────┘
```

**Rekomendowany stos:**
- **Płatności:** Stripe Checkout (hosted page — brak wrażliwych danych po naszej stronie)
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions) lub Vercel Functions
- **Hosting frontendu:** Vercel lub GitHub Pages (bez zmian)

**Kolejność implementacji:**
1. Panel rodzica (formularz konfiguracyjny → generuje plik do pobrania) — bez płatności
2. Hosting konfiguracji jako JSON na Supabase — link zamiast pliku
3. Stripe — bramka płatności przed dostępem do linku
4. Dashboard rodzica — podgląd postępu dziecka w czasie rzeczywistym

**Zmiany w kodzie gry przy każdym kroku:**
- Krok 1: brak (plik generowany statycznie)
- Krok 2: jedna linijka — `CONFIG = await fetch(...)` zamiast `const CONFIG = {...}`
- Krok 3: brak (płatność obsługiwana przed wejściem na stronę)
- Krok 4: dodanie WebSocket lub polling do synchronizacji postępu

---

## ADR-007 — Brak lockowania kolejności misji

**Status:** Aktywna

**Kontekst:**
Możliwe podejście: misje odblokowują się sekwencyjnie (1 → 2 → 3...). Możliwe: wszystkie dostępne od razu.

**Decyzja:**
Wszystkie misje dostępne od początku. Dziecko wybiera kolejność.

**Uzasadnienie:**
- Dzieci w różnym wieku mają różne preferencje — 9-latek może zacząć od gry reflexowej zamiast quizu
- Zmniejsza frustrację przy trudnych misjach (można wrócić)
- Prostszy kod (brak zależności między misjami)

**Kiedy warto zrewidować:**
Przy fabularnym trybie narracyjnym, gdzie kolejność misji jest częścią historii.
