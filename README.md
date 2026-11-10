# Μάθε Μπριτζ – learn.heraklion-bridge.gr

Learning material of the Heraklion Bridge Club (Όμιλος Μπριτζ Ηρακλείου): lecture slides and interactive quizzes, all in Greek. It is a plain static site (HTML/CSS/JS, no build step) served by GitHub Pages at **https://learn.heraklion-bridge.gr**. The club's main website (www.heraklion-bridge.gr) stays on WordPress and links here.

## Contents

The site has a left icon rail (home, Μαθήματα, Quiz, Για παίκτες, club site), white cards on an off-white background, and a «Υλικό» sidebar with counts and search on every page. The look follows the bridgetricks.com resource pages.

| URL | What | Files |
|---|---|---|
| `/` | home page: rows for Μαθήματα, Quiz and Για παίκτες | `index.html` |
| `/lectures/` | central menu **Μαθήματα**: lists the lesson cycles (for now one) | `lectures/index.html` |
| `/lectures/a-kyklos/` | **Α κύκλος Μαθημάτων**: the eight units with their slide counts | `lectures/a-kyklos/index.html` |
| `/lectures/<unit>/` | lecture slides ([reveal.js](https://revealjs.com) 5.1.0, stored in `lectures/vendor/reveal/`) | `lectures/<unit>/index.html`, `lectures/deck.css`, `lectures/deck.js` |
| `/quiz/` | central menu **Quiz**: lists the cycles | `quiz/index.html` |
| `/quiz/a-kyklos/` | **Quiz Α' Κύκλου Μαθημάτων**: the eight quizzes with their question counts | `quiz/a-kyklos/index.html` |
| `/quiz/<unit>/` | one quiz per unit | `quiz/<unit>/{index.html,questions.js}` |
| `/paiktes/` | hub for players who finished the lessons or play already. Διανομές, Συμβάσεις, Κουίζ and Υλικό are greyed out as «Σύντομα»; the page is `noindex` and not in the sitemap | `paiktes/index.html` |
| `/paiktes/karta-symvaseon/` | **Κάρτα συμβάσεων**: a printable convention card builder (form, live preview, print / PDF). No server: it saves in the browser (localStorage), can be saved as a `.json` file, opened from a file or shared as a link (the card is encoded after the `#`, so nothing is sent anywhere). Defaults button, suit symbols (`!s !h !d !c`) and user-added conventions are built in | `paiktes/karta-symvaseon/{index.html,convention-card.js}` |
| `/paiktes/systimata/` | **Συστήματα**: a bidding-system editor (tree of calls with their meanings and replies, table view, print / PDF). Same approach as the card: saved in the browser, `.json` file or share link (up to 500 calls) | `paiktes/systimata/{index.html,systimata.js}` |
| `/mathites/`, `/lectures/mathima-1/`, `/lectures/mathima-2/`, `/quiz/mathima-1/`, `/quiz/mathima-2/`, `/quiz/mathima-5/`, `/quiz/mathima-6/` | old addresses that only redirect (links to them were shared); they must stay | `mathites/index.html`, `lectures/mathima-*/`, `quiz/mathima-*/` |

Units are named by topic and numbered 01–08 in teaching order (shown as «Ενότητα NN» in titles and list rows; URLs have no numbers): `vasika-tou-mpritz`, `kanones-agoras`, `epilogi-symvolaiou`, `anoigma-1xa`, `technikes-ektelesis`, `anoigma-1-mazer`, `xemplokarisma-chromatista`, `anoigma-1-miner`.

Shared parts: `assets/site.js` (rail, «Υλικό» sidebar, search, footer: **edit `SITE` at the top**), `assets/style.css`, `assets/quiz.js` (the quiz engine), `assets/stats.js` (statistics, see below). The slide decks use only `lectures/deck.css` / `deck.js` and have no rail.

## Editing

- **Units and cycles:** the sidebar («Μαθήματα → Α κύκλος», «Quiz → Α' κύκλος») and the search are built from `SITE.cycles` at the top of `assets/site.js`. The list pages are plain HTML rows: `<a class="res" href="../<unit>/">` with a CSS thumbnail (`<span class="thumb">` with `<span class="tc">` cards), a `<p class="meta">`, `<h3>`, description and `<span class="go">`. A new *cycle* = a new entry in `SITE.cycles`, a folder like `lectures/a-kyklos/` and `quiz/a-kyklos/`, and one row in each central menu.
- **Players' area (`/paiktes/`):** rows with `class="res soon"` are placeholders; turn one into `<a class="res" href="…">`, create the folder (`paiktes/<section>/…`) and add it to `SITE.players` in `assets/site.js` (`pages` = pages directly under «Για παίκτες», `sections` = sub-menus with a list of pages). The finished Συμβάσεις (20 pages, with their CSS: `.seq` tables, `.conv-list`, `.level-tag`) and Υλικό pages are kept on the git branch `paiktes-content` (written for the previous design; bring them in with `git checkout paiktes-content -- paiktes`, merge the CSS by hand and adapt the markup to the `res` rows).
- **Rail and footer:** `SITE.rail` and `SITE.footer` in `assets/site.js`. Addresses starting with `https://` are used as they are (links to the club's site).
- **Quiz questions:** plain text in `quiz/<unit>/questions.js` (instructions at the top of the file). The page picks changes up automatically.
- **New quiz:** copy `quiz/epilogi-symvolaiou/` to `quiz/<topic-slug>/`, edit `questions.js` and the texts in `index.html`, then add a row to `quiz/a-kyklos/index.html`, an entry to `SITE.cycles` and the address to `sitemap.xml`. Set `next` in the previous quiz's `questions.js` to `{ label: '…', href: 'quiz/<topic-slug>/' }`.
- **Slides:** each slide is a `<section>…</section>` in `lectures/<unit>/index.html` (units are numbered 01, 02, 03… in teaching order). Building blocks (styled in `lectures/deck.css`): `<div class="example">`, `class="fragment"`, playing cards `<span class="pc">♠K</span>` (add `red` for ♥ ♦). **New deck:** copy `lectures/vasika-tou-mpritz/`, replace the slides, add a row in `lectures/a-kyklos/index.html`, an entry in `SITE.cycles` and the page in `sitemap.xml`. The project skill `lecture-from-summary` (`.claude/skills/`) does all of this from a summary PDF and checks it with `check.py`.
  Shortcuts while viewing: arrows/Space = next/previous, **Esc** = overview, **F** = full screen, **?** = help; add `?print-pdf` to the address to print or save as PDF.
- **Convention card fields:** the form fields, the list of conventions and the «τυπικές τιμές» (defaults) are the `SECTIONS`, `CONV_GROUPS` and `DEFAULTS` lists at the top of `paiktes/karta-symvaseon/convention-card.js`.
- **PDF:** the card and the systems tool build their PDFs in the browser with `assets/pdf.js` (jsPDF and a DejaVu Sans subset in `assets/vendor/pdf/`, loaded only when a PDF is requested).

## Preview on your computer

```bash
python3 -m http.server 8000
```
then open http://localhost:8000.

## Publishing (GitHub Pages + `learn.heraklion-bridge.gr`)

1. Repository → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
2. DNS for `heraklion-bridge.gr`: add a **CNAME** record `learn` → `heraklion-bridge.github.io` (the GitHub organization `heraklion-bridge`) (in Cloudflare set it to *DNS only*).
3. **Settings → Pages → Custom domain**: `learn.heraklion-bridge.gr` (the `CNAME` file in this repo already says so), then tick **Enforce HTTPS** once it is offered.

## Credits

Quiz questions and slides are based on lesson summaries of the first cycle. reveal.js is MIT-licensed (`lectures/vendor/reveal/LICENSE`).

## Statistics

Anonymous, cookie-free usage statistics via [GoatCounter](https://www.goatcounter.com): dashboard at https://heraklionbridge.goatcounter.com (log in with the club's account). `assets/stats.js` injects the script; it is loaded by `assets/site.js` (all normal pages) and `lectures/deck.js` (slides). Page views give visits per page. Custom events (paths in the dashboard): `quiz-start/<unit>` (first answer given), `quiz-finish/<unit>` (result screen reached), `quiz-score/<unit>/<correct>-of-<total>` (score histogram) and `deck-end/<unit>` (last slide reached). Localhost is ignored by GoatCounter. To remove the statistics, delete `assets/stats.js` and the `loadStats` call in `site.js` / the block in `deck.js`.
