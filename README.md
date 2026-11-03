# Μάθε Μπριτζ – learn.heraklion-bridge.gr

Learning material of the Heraklion Bridge Club (Όμιλος Μπριτζ Ηρακλείου): lecture slides and interactive quizzes, all in Greek. It is a plain static site (HTML/CSS/JS, no build step) served by GitHub Pages at **https://learn.heraklion-bridge.gr**. The club's main website (www.heraklion-bridge.gr) stays on WordPress and links here.

## Contents

| URL | What | Files |
|---|---|---|
| `/` | home page: two buttons, "Για μαθητές" and "Για παίκτες" | `index.html` |
| `/mathites/` | hub for students (the first-cycle lessons): buttons to the slides and the quizzes | `mathites/index.html` |
| `/paiktes/` | hub for players who finished the lessons or play already: four buttons (Διανομές, Συμβάσεις, Κουίζ, Υλικό), all greyed out as «Σύντομα» for now (the page is `noindex` and not in the sitemap). The finished Συμβάσεις (20 pages) and Υλικό pages live on the git branch `paiktes-content` | `paiktes/index.html` |
| `/lectures/` | lecture slides ([reveal.js](https://revealjs.com) 5.1.0, stored in `lectures/vendor/reveal/`) | `lectures/index.html`, `lectures/<unit>/index.html`, `lectures/deck.css`, `lectures/deck.js` |
| `/quiz/` | one quiz per unit (`vasika-tou-mpritz`, `kanones-agoras`, `epilogi-symvolaiou`, `anoigma-1xa`, `technikes-ektelesis`, `anoigma-1-mazer`, `xemplokarisma-chromatista`, `anoigma-1-miner` are listed; the old `mathima-5`/`mathima-6` quiz addresses are redirect stubs) | `quiz/index.html`, `quiz/<unit>/{index.html,questions.js}` |

Shared parts: `assets/site.js` (top menu and footer – **edit the `menu` and `footer` blocks at the top**), `assets/style.css`, `assets/quiz.js` (the quiz engine).

## Editing

- **Add a button to the home page / a hub:** copy one `<a class="quiz-tile">…</a>` block in `index.html`, `mathites/index.html` or `paiktes/index.html`.
- **Material for players (`/paiktes/`):** every button on the hub is a `<div class="quiz-tile soon">` placeholder. To publish a section, turn its tile into `<a class="quiz-tile" href="…">`, create the section folder (`paiktes/<section>/…`), add it to the sitemap, and remove the hub's `noindex` when the first section goes live. The ready-made Συμβάσεις and Υλικό sections (with their CSS: `.seq` tables, `.conv-list`, `.level-tag`) are on the branch `paiktes-content`: bring them in with `git checkout paiktes-content -- paiktes assets/style.css` (merge the CSS by hand) and re-add the menu entry if wanted. Slides and quizzes for players can live in `paiktes/<section>/<topic>/` (copy a lecture deck or a quiz folder and fix the `../` paths).
- **Conventions pages** (on branch `paiktes-content`): one folder per convention, plain HTML; bidding sequences are `<table class="seq">` (rows `<tr class="l1|l2|l3"><th scope="row">bid</th><td>meaning</td></tr>`, `<tr class="sub">` = sub-heading, `<caption>` = table title). Wrap ♥ ♦ in `<span class="rs">`.
- **Menu:** `menu` list at the top of `assets/site.js`. Addresses starting with `https://` are used as they are (links to the club's site).
- **Quiz questions:** plain text in `quiz/<unit>/questions.js` (instructions at the top of the file). The page picks changes up automatically.
- **New quiz:** copy `quiz/epilogi-symvolaiou/` to `quiz/<topic-slug>/`, edit `questions.js` and the texts in `index.html`, then add it to the menu in `assets/site.js` (under "Για μαθητές"), to the list in `quiz/index.html` and to `sitemap.xml`. Set `next` in the previous quiz's `questions.js` to `{ label: '…', href: 'quiz/<topic-slug>/' }`.
- **Slides:** each slide is a `<section>…</section>` in `lectures/<unit>/index.html` (eight decks exist: `vasika-tou-mpritz`, `kanones-agoras`, `epilogi-symvolaiou`, `anoigma-1xa`, `technikes-ektelesis`, `anoigma-1-mazer`, `xemplokarisma-chromatista`, `anoigma-1-miner`; units are named by topic and numbered 01, 02, 03… in teaching order (shown as «Ενότητα NN» in titles and tile kickers; URLs have no numbers); the old `mathima-1`/`mathima-2` addresses are redirect stubs that must stay, because links to them were shared). Building blocks (styled in `lectures/deck.css`): `<div class="example">`, `class="fragment"`, playing cards `<span class="pc">♠K</span>` (add `red` for ♥ ♦). **New deck:** copy `lectures/mathima-1/`, replace the slides, add a tile in `lectures/index.html` and the page in `sitemap.xml`.
  Shortcuts while viewing: arrows/Space = next/previous, **Esc** = overview, **F** = full screen, **?** = help; add `?print-pdf` to the address to print or save as PDF.

## Preview on your computer

```bash
python3 -m http.server 8000
```
then open http://localhost:8000.

## Publishing (GitHub Pages + `learn.heraklion-bridge.gr`)

1. Repository → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
2. DNS for `heraklion-bridge.gr`: add a **CNAME** record `learn` → `<your-github-username>.github.io` (in Cloudflare set it to *DNS only*).
3. **Settings → Pages → Custom domain**: `learn.heraklion-bridge.gr` (the `CNAME` file in this repo already says so), then tick **Enforce HTTPS** once it is offered.

## Credits

Quiz questions and slides are based on lesson summaries of the first cycle. reveal.js is MIT-licensed (`lectures/vendor/reveal/LICENSE`).

## Statistics

Anonymous, cookie-free usage statistics via [GoatCounter](https://www.goatcounter.com): dashboard at https://heraklionbridge.goatcounter.com (log in with the club's account). `assets/stats.js` injects the script; it is loaded by `assets/site.js` (all normal pages) and `lectures/deck.js` (slides). Page views give visits per page. Custom events (paths in the dashboard): `quiz-start/<unit>` (first answer given), `quiz-finish/<unit>` (result screen reached), `quiz-score/<unit>/<correct>-of-<total>` (score histogram) and `deck-end/<unit>` (last slide reached). Localhost is ignored by GoatCounter. To remove the statistics, delete `assets/stats.js` and the `loadStats` call in `site.js` / the block in `deck.js`.
