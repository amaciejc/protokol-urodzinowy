# Deployment — GitHub Pages

Instrukcja krok po kroku: od zera do działającej gry online.

---

## Wymagania wstępne

- Konto na [github.com](https://github.com) (bezpłatne)
- Git zainstalowany lokalnie **lub** używamy interfejsu www GitHub (bez Git)

---

## Opcja A — Przez interfejs GitHub (bez Git, 5 minut)

### Krok 1 — Utwórz repozytorium

1. Wejdź na [github.com/new](https://github.com/new)
2. Wpisz nazwę repozytorium, np. `protokol-urodzinowy`
3. Ustaw jako **Public** (wymagane dla bezpłatnego GitHub Pages)
4. Kliknij **Create repository**

### Krok 2 — Wgraj pliki

1. W nowym repo kliknij **Add file → Upload files**
2. Wgraj:
   - `protokol-urodzinowy.html` — **WAŻNE: przemianuj na `index.html`** przed wgraniem
   - `README.md`
   - Folder `docs/` ze wszystkimi plikami `.md`
3. Kliknij **Commit changes**

### Krok 3 — Włącz GitHub Pages

1. Wejdź w **Settings** repozytorium (górna belka)
2. Kliknij **Pages** w lewym menu
3. W sekcji **Branch** wybierz: `main` / `root`
4. Kliknij **Save**
5. Po ~2 minutach gra jest dostępna pod adresem:
   ```
   https://twoja-nazwa.github.io/protokol-urodzinowy/
   ```

---

## Opcja B — Przez Git (terminal)

```bash
# 1. Sklonuj lub zainicjalizuj repo
git init protokol-urodzinowy
cd protokol-urodzinowy

# 2. Dodaj pliki
cp /ścieżka/do/protokol-urodzinowy.html index.html
cp /ścieżka/do/README.md .
mkdir docs && cp /ścieżka/do/docs/* docs/

# 3. Pierwszy commit
git add .
git commit -m "feat: initial game release"

# 4. Połącz z GitHubem (po utworzeniu repo na github.com)
git remote add origin https://github.com/twoja-nazwa/protokol-urodzinowy.git
git branch -M main
git push -u origin main

# 5. Włącz Pages (patrz Krok 3 z Opcji A)
```

---

## Aktualizacja gry

Po każdej zmianie w `index.html`:

**Opcja A (www):**
1. Wejdź w repozytorium na GitHubie
2. Kliknij `index.html` → ołówek (Edit)
3. Wklej nową wersję kodu
4. Kliknij **Commit changes**
5. Poczekaj ~1 minutę → gra zaktualizowana

**Opcja B (Git):**
```bash
git add index.html
git commit -m "fix: poprawione pytania quizowe"
git push
```

---

## Struktura repozytorium na GitHubie

```
twoja-nazwa/protokol-urodzinowy
├── index.html        ← gra (GitHub Pages serwuje stąd)
├── README.md         ← wyświetlany na stronie repo
└── docs/
    ├── 01-wymagania.md
    ├── 02-architektura.md
    ├── 03-adr.md
    ├── 04-deployment.md   ← ten plik
    ├── 05-nowe-misje.md
    └── 06-personalizacja.md
```

---

## Niestandardowa domena (opcjonalnie)

Jeśli chcesz `protokol-urodzinowy.pl` zamiast `github.io/...`:

1. Kup domenę (np. OVH, Namecheap)
2. W DNS domeny dodaj rekord:
   ```
   CNAME  www  twoja-nazwa.github.io
   ```
3. W Settings → Pages → Custom domain wpisz: `www.protokol-urodzinowy.pl`
4. Zaznacz **Enforce HTTPS**

---

## Prywatność

GitHub Pages na bezpłatnym koncie wymaga **publicznego** repozytorium. Oznacza to, że kod gry jest publicznie dostępny — jest to OK, bo:
- Gra nie zawiera danych osobowych (imię dziecka jest w CONFIG, ale to nie jest wrażliwa dana)
- Kod terenowy (`fieldCode`) jest w pliku — **jeśli to problem**, zmień go po każdych urodzinach

W płatnym planie GitHub (GitHub Pro, $4/mies.) można używać GitHub Pages z prywatnym repozytorium.

---

## Diagnostyka

**Gra nie pojawia się po aktywacji Pages:**
- Poczekaj 2–5 minut (cache CDN)
- Sprawdź czy plik nazywa się dokładnie `index.html` (nie `Index.html`)
- Sprawdź Settings → Pages → czy pokazuje zielony "Your site is live at..."

**Gra się ładuje ale nie działa:**
- Otwórz narzędzia developerskie (F12) → zakładka Console
- Szukaj błędów JavaScript (czerwony tekst)

**Dźwięki nie działają na tablecie:**
- To normalne przy pierwszym ładowaniu — przeglądarka wymaga interakcji użytkownika przed uruchomieniem audio
- Pierwsze kliknięcie w grze odblokowuje dźwięki
