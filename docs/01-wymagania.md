# Wymagania funkcjonalne — Protokół Urodzinowy

## 1. Cel produktu

Gra urodzinowa uruchamiana na tablecie. Dziecko wciela się w agenta szpiegowskiego i przechodzi przez serię misji (quizy, mini-gry, zadania fizyczne). Każda zaliczona misja ujawnia fragment tajnego kodu. Złożenie wszystkich fragmentów otwiera "skarbiec" — rodzic na podstawie kodu wydaje prezent.

---

## 2. Użytkownicy

**Gracz (dziecko):** 7–12 lat, używa tabletu samodzielnie. Nie czyta instrukcji — gra musi prowadzić go za rękę.

**Rodzic / organizator:** konfiguruje grę przed urodzinami (imię, kody, karteczki), obserwuje przebieg, wydaje prezenty na podstawie kodu końcowego.

---

## 3. Flow użytkownika

```
[Boot screen]
    ↓ animacja ~5s
[Briefing]
    ↓ kliknięcie "Zaakceptuj misję"
[Centrum dowodzenia — wybór misji]
    ↓ dziecko wybiera misję (dowolna kolejność)
[Misja 1–5]
    ↓ zaliczenie → overlay z kodem fragmentu
[Centrum dowodzenia]
    ↓ po zaliczeniu 5/5 → przycisk "Otwórz skarbiec"
[Skarbiec — ujawnienie kodów]
    ↓ kliknięcie "Odbierz nagrody"
[Ekran sukcesu — master kod]
```

---

## 4. Ekrany

### 4.1 Boot screen
- Animowany terminal — sekwencja linii tekstowych pojawiających się z opóźnieniem
- Trwa ~5 sekund, po czym automatycznie przechodzi do briefingu
- Dźwięki klawiaturowe w tle

### 4.2 Briefing
- Dane agenta: imię, wiek, ID, clearance level
- Komunikat od dowództwa — pojawia się metodą typewriter (litera po literze)
- Parametry misji (tabela: agent, wiek, liczba misji, cel, status)
- Przycisk "Zaakceptuj misję" → centrum dowodzenia

### 4.3 Centrum dowodzenia (mission select)
- Pasek postępu: X/5 misji ukończonych
- Siatka 5 kart misji (2 kolumny)
- Każda karta: numer misji, ikona, nazwa, opis, status (dostępna / zaliczona + kod)
- Wszystkie misje dostępne od razu (brak lockowania kolejności)
- Pasek zebranych fragmentów kodu (ukryte jako `__` do momentu zaliczenia)
- Przycisk "Otwórz skarbiec" — pojawia się dopiero gdy 5/5 zaliczone
- Przycisk "Resetuj postęp" — dla testów / ponownego uruchomienia
- Postęp zapisywany w localStorage (przeżywa odświeżenie strony)

### 4.4 Misja 1 — Quiz wiedzy
- 6 pytań losowanych z puli (aktualnie 11 pytań)
- Kategorie: Minecraft, Roblox, Piłka nożna
- 4 odpowiedzi na pytanie, układ 2×2
- Odpowiedzi tasowane losowo przy każdym uruchomieniu
- Po wyborze: natychmiastowy feedback (zielony = OK, czerwony = błąd + podświetlenie poprawnej)
- Próg zaliczenia: 60% (4/6 poprawnych)
- Nieudana misja → overlay "Spróbuj ponownie" z opcją retry lub powrotu

### 4.5 Misja 2 — Matematyka
- 4 zadania słowne dostosowane do 9-latka
- Numeryczny numpad dotykowy (nie klawiatura systemowa — tablet friendly)
- Podpowiedź po błędnej odpowiedzi
- Nieograniczona liczba prób per zadanie (reset pola, podpowiedź)
- Wszystkie 4 zadania muszą być rozwiązane żeby ukończyć misję

### 4.6 Misja 3 — Refleks
- Arena z losowo pojawiającymi się celami (SVG crosshair)
- Cel aktywny przez 2,2 sekundy — potem znika (miss)
- Cel do: trafić 10 celów w 30 sekund
- Liczniki na żywo: trafione / czas / chybione
- Timer zmienia kolor na czerwony przy ≤10 sekundach
- Efekt wizualny po trafieniu (flash)

### 4.7 Misja 4 — Memory
- 12 kart (6 par emoji: ⛏️ 💎 ⚽ 🗡️ 🍎 🎮)
- Odkryj 2 karty → jeśli para → zostają odkryte
- Liczniki: znalezione pary / liczba prób
- Brak limitu prób ani czasu — cel: ukończyć (znajdź wszystkie 6 par)

### 4.8 Misja 5 — Terenowa
- Wyświetla zagadkę wskazującą fizyczną lokalizację karteczki
- Pole do wpisania kodu z karteczki (tekst, max 8 znaków, auto-uppercase)
- Kod skonfigurowany przez rodzica w `CONFIG.fieldCode`
- Nieograniczone próby wpisania kodu

### 4.9 Skarbiec
- Animowane ujawnianie 5 fragmentów kodu (jeden po drugim z dźwiękiem)
- Złożony master kod wyświetlony wyraźnie (instrukcja: "pokaż rodzicom")
- Konfetti

### 4.10 Sukces
- Duże trofeum, gratulacje
- Ponowne wyświetlenie master kodu
- Możliwość powrotu do centrum

---

## 5. Tryb rodzicielski

- Uruchomienie: 5 kliknięć w napis z imieniem agenta na ekranie briefingu
- Wyświetla: wszystkie kody misji, master kod, kod terenowy (do wpisania na karteczce)
- Forma: natywny `alert()` przeglądarki

---

## 6. Dźwięki

| Akcja | Dźwięk |
|---|---|
| Kliknięcie przycisku | krótki klik (square wave) |
| Poprawna odpowiedź | trzy wznoszące się tony |
| Błędna odpowiedź | opadające "buzz" |
| Zaliczenie misji | fanfara 5 tonów |
| Finał / sukces | uroczyste 4 tony |
| Trafienie celu (refleks) | krótki sygnał |
| Odkrycie karty (memory) | delikatny tap |

Wszystkie dźwięki generowane przez Web Audio API (brak zewnętrznych plików).

---

## 7. Persystencja danych

- Silnik: `localStorage` przeglądarki
- Klucze: `pb_done` (lista zaliczonych misji)
- Przeżywa: odświeżenie strony, zamknięcie przeglądarki, uśpienie tabletu
- Reset: przycisk "Resetuj postęp" w centrum dowodzenia

---

## 8. Wymagania niefunkcjonalne

- **Offline:** gra działa bez internetu po pobraniu pliku
- **Tablet-first:** przyciski min. 52px wysokości, duże obszary dotykowe
- **Responsywność:** działa na ekranach 768px–1366px (portret i pejzaż)
- **Brak zależności:** zero zewnętrznych bibliotek, zero CDN
- **Przeglądarka:** Chrome 90+, Safari 14+, Firefox 88+ (wszystkie nowoczesne)
- **Czas ładowania:** natychmiastowy (jeden plik, ~64KB)

---

## 9. Konfiguracja (CONFIG)

Wszystkie zmienne wymagane do personalizacji gry są w jednym obiekcie `CONFIG` na górze pliku JS. Żadna logika gry nie jest hardkodowana poza tym obiektem.

```js
CONFIG = {
  agentName:    "KUBA",        // imię dziecka
  agentAge:     9,             // wiek
  missionCodes: ["KU","BA","07","XY","ZZ"],  // fragmenty kodu
  fieldCode:    "AGENT",       // kod na karteczce terenowej
  fieldClue:    "...",         // treść zagadki terenowej
}
```

---

## 10. Czego gra nie robi (out of scope — MVP)

- Brak logowania / kont użytkowników
- Brak synchronizacji między urządzeniami
- Brak rankingów
- Brak edytora misji dla rodziców (trzeba edytować plik JS)
- Brak wersji wielojęzycznej
