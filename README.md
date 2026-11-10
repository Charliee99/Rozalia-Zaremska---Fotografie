# Rozalia Zaremska – Fotografia (Warszawa)

Strona internetowa fotografki Rozalii Zaremskiej. Cel: prezentacja stylu pracy i pozyskiwanie zapytań o sesje.

Strona jest **statyczna** (HTML + CSS + odrobina JavaScriptu, bez frameworków i panelu administracyjnego). Wszystkie zmiany wprowadza się w kodzie w tym repozytorium.

## Struktura

```
index.html                 strona główna (hero, o mnie, portfolio, oferta, proces, opinie, FAQ, kontakt)
polityka-prywatnosci.html  polityka prywatności (RODO)
dziekuje.html              podziękowanie po wysłaniu formularza (gdy JS jest wyłączony)
assets/css/style.css       style; kolory i fonty jako zmienne w :root
assets/js/main.js          menu mobilne, formularz (walidacja, wysyłka, komunikaty)
assets/img/                zdjęcia w AVIF / WebP / JPG w szerokościach 480–1600 px
assets/fonts/              fonty Cormorant Garamond + Jost (hostowane lokalnie)
scripts/                   skrypty do generowania zdjęć i kopiowania fontów
robots.txt, sitemap.xml    SEO
```

## ✅ Do zrobienia przed startem

1. **Klucz formularza (Web3Forms)**
   - Wejdź na <https://web3forms.com>, wpisz adres e-mail Rozalii i odbierz klucz `access_key` z maila.
   - W `index.html` zamień `WSTAW_KLUCZ_WEB3FORMS` na otrzymany klucz.
   - Wiadomości trafiają na ten adres, a przycisk „Odpowiedz” w poczcie odpisuje bezpośrednio klientowi (Reply-To = e-mail klienta).
2. **Dane kontaktowe** – podmień we wszystkich plikach `.html` i w `assets/js/main.js` (szukaj i zamień):
   - `kontakt@rozaliazaremska.pl` → prawdziwy e-mail,
   - `https://www.instagram.com/rozaliazaremska/` i `@rozaliazaremska` → prawdziwy profil.
3. **Opinie** – w sekcji `#opinie` w `index.html` są **przykładowe** teksty. Zastąp je prawdziwymi opiniami klientów (za ich zgodą).
4. **Ceny** – w kafelkach oferty są ceny orientacyjne („od…”). Zweryfikuj kwoty i zakres („20 zdjęć w obróbce” itd.).
5. **Polityka prywatności** – to wzór; warto uzupełnić dane administratora (np. NIP, jeśli jest działalność) i sprawdzić treść.
6. **Domena** – jeśli strona będzie pod własną domeną, zamień `https://charliee99.github.io/Rozalia-Zaremska---Fotografie/` w `index.html`, `polityka-prywatnosci.html`, `robots.txt` i `sitemap.xml` (oraz pole `redirect` w formularzu).

## Publikacja (GitHub Pages)

Repozytorium → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.
Po chwili strona będzie dostępna pod `https://charliee99.github.io/Rozalia-Zaremska---Fotografie/`.
Każdy `git push` na `main` automatycznie aktualizuje stronę.

## Jak wprowadzać zmiany

- **Teksty** – edytuj bezpośrednio `index.html` (sekcje są opisane komentarzami `<!-- ============ OFERTA ============ -->` itd.).
- **Ceny** – w kafelkach oferty: `<p class="price"><small>od</small>600 zł</p>`.
- **FAQ** – bloki `<details>` w sekcji `#faq` (oraz – dla SEO – dane strukturalne `FAQPage` na końcu pliku).
- **Kolory i fonty** – zmienne na początku `assets/css/style.css`.

### Zdjęcia

Oryginały w pełnej rozdzielczości **nie trafiają do repozytorium** (są ignorowane przez `.gitignore`) – na stronie publikowane są tylko zoptymalizowane wersje.

1. Zainstaluj zależności (raz): `npm install`
2. Wrzuć oryginał do folderu `Zdjęcie - strona/` (lub wskaż inny przez zmienną `SOURCE_DIR`).
3. Dopisz go w `MANIFEST` w `scripts/optimize-images.mjs` (nazwa pliku → nazwa wyjściowa, np. `sesja-plenerowa-warszawa`).
4. Uruchom `npm run images` – powstaną pliki `nazwa-480/800/1200/1600` w formatach `.avif`, `.webp`, `.jpg`.
5. Wstaw zdjęcie w `index.html`, kopiując istniejący blok `<picture>` i zmieniając nazwy plików oraz tekst `alt` (opisowy, z frazą lokalną, np. „Sesja brzuszkowa w Warszawie – …”).

### Podgląd lokalny

```bash
npm install
npm run serve
```

Strona: <http://localhost:8080>

## Co zostało zadbane

- **Szybkość**: AVIF/WebP z fallbackiem JPG, `srcset`/`sizes`, `loading="lazy"` poza pierwszym ekranem, preload zdjęcia głównego i fontów, fonty lokalne (WOFF2), brak bibliotek JS.
- **SEO**: tytuł i opis z frazami lokalnymi („fotograf Warszawa”, rodzaje sesji), hierarchia nagłówków, teksty alternatywne, dane strukturalne `ProfessionalService` + `FAQPage`, Open Graph, `sitemap.xml`, `robots.txt`, kanoniczne adresy.
- **Dostępność**: kontrast zgodny z WCAG AA, link „Przejdź do treści”, pełna obsługa klawiaturą (menu zamykane klawiszem Esc, widoczny fokus), etykiety pól, komunikaty błędów powiązane z polami (`aria-describedby`, `aria-invalid`), status wysyłki w `aria-live`, respektowanie `prefers-reduced-motion`.
- **Formularz**: walidacja z komunikatami po polsku, zgoda RODO (wymagana), ochrona przed spamem (pole-pułapka *honeypot* + minimalny czas wypełnienia + filtr Web3Forms), komunikat potwierdzenia, obsługa błędów sieci/serwera/limitu, działa także bez JavaScriptu.
