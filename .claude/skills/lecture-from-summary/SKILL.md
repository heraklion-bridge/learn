---
name: lecture-from-summary
description: Turn a bridge lesson-summary PDF (e.g. A3-BasicsBid-Summary.pdf, "Περίληψη μαθήματος…") into a numbered Greek unit for learn.heraklion-bridge.gr - a reveal.js lecture deck plus the matching quiz (created only if missing), wired into the site, checked by an automatic script and verified in the browser. Use when the user gives a summary PDF and asks for the lecture / slides / notes / quiz ("γράψε μου το μάθημα", "φτιάξε διαφάνειες και κουίζ", "import this lecture overview", "διαφάνειες", "κουίζ") for the students area.
argument-hint: <path to summary PDF> [quiz exists | create quiz]
---

# Unit (lecture + quiz) from a lesson-summary PDF

The site is a plain static site (no build step). Everything is in Greek. A unit has up to two artifacts:

| Artifact | Path | Reference to copy the style from |
|---|---|---|
| Slides | `lectures/<slug>/index.html` | `lectures/kanones-agoras/` or `lectures/epilogi-symvolaiou/` |
| Quiz | `quiz/<slug>/{index.html,questions.js}` | `quiz/epilogi-symvolaiou/` (header comment of `quiz/vasika-tou-mpritz/questions.js` documents every field) |

"Lecture notes" in the user's words = the slide deck. Stay consistent with the existing decks and quizzes: read at least one existing deck in full before writing a new one.

## Naming: units, not lessons (request of the teacher who writes the summaries)

The material must not be tied to lesson numbers, so that other instructors, other clubs and self-learners can use it as a series of *units* in any order. Therefore, for **every unit**:

- Title = the topic title of the summary (e.g. «Αρχές επιλογής συμβολαίου»), never «Μάθημα N» / «Α΄ κύκλος · Μάθημα N» (title slide, `<title>`, meta, headings, tiles, quiz page, quiz note, menu).
- **Units are numbered `01`, `02`, `03`… in teaching order** (requested by the site owner, so students can see how each unit builds on the previous one), always written as «Ενότητα NN» (never «Μάθημα»): title slide `p.big` = «Ενότητα NN · <υπότιτλος>», `<title>` = «Ενότητα NN · <τίτλος> – Διαφάνειες …», quiz `<h1>`/`<title>` = «Κουίζ NN: <τίτλος>», tile kickers «Ενότητα NN · N διαφάνειες» / «Ενότητα NN · N ερωτήσεις», `next` labels «Κουίζ NN: …», last-slide buttons short «Κουίζ NN», «← Ενότητα NN», «Ενότητα NN →» (long labels make the slide overflow), and the «Τι χρειάζεσαι από πριν» slide links to the units it needs («ενότητα 01 «…»»). URL slugs stay topic names (no numbers). The next number = the highest existing unit + 1.
- Slug = transliterated topic, e.g. `lectures/epilogi-symvolaiou/`, `quiz/epilogi-symvolaiou/`. (The first two units were renamed from `mathima-1`/`mathima-2` to `vasika-tou-mpritz`/`kanones-agoras`; the old addresses are redirect stubs in `lectures/mathima-N/` and `quiz/mathima-N/`. Never delete them: links to them were shared. The quizzes of units 05 and 06 were renamed from `mathima-5`/`mathima-6` to `technikes-ektelesis`/`anoigma-1-mazer` in the same way.)
- No «Από το προηγούμενο μάθημα» slide: use «Τι χρειάζεσαι από πριν» (the concepts needed, with a link to the unit that covers them, named by title).
- **End-of-unit links are minimal (requested by the site owner):** the last slide has only two buttons, the quiz of this unit and «← Α κύκλος Μαθημάτων» (back to the list); a quiz ends with «Παίξτε ξανά» and «← Quiz Α' Κύκλου Μαθημάτων» (back to the quiz list). No links to the previous / next unit or quiz and no club-lessons link. The text may still mention other units by their title, but without links; nothing has to be added to the previous deck.
- **Never name the teacher (or the summary author) anywhere on the site or in the repo**: no credit lines, no names in the PDF-derived text, titles, notes, README or this skill. Say «βασίζονται σε περίληψη» only if needed, without a name. This is the teacher's explicit request. (Source PDFs stay untracked and are never committed.)

The teacher forwards the links to the students and is wary of surprises: **stick strictly to the summary**. List everything you derived or added (even simple arithmetic or an extra example) in the final report, and don't explain things the summary only shows without explaining (e.g. the two values «300 ή 500» of a bonus).

## Workflow

1. **Read the PDF.** Use `Read` with `pages` (it shows page images, so suit symbols, colours and tables are visible: render a page with `pdftoppm -r 150 -png` if you need to see colour codes); `pdftotext -layout` is available as a cross-check. Take the topic title from the PDF (not a lesson number) and decide the unit number `NN` = highest existing unit + 1 (look at `lectures/index.html`). The summary is the source of truth.
2. **Check what exists:** `ls lectures quiz`, and whether `quiz/<slug>/` exists. The user usually says whether the quiz is already there; if it is, read its `questions.js` — the deck must agree with it (same terms, same examples where sensible, same question count in the last slide).
3. **Write the deck** `lectures/<slug>/index.html` (see "Deck conventions"). Do not copy long passages of the summary verbatim into slides; explain, then give an example.
4. **Wire it into the site** (see "Wiring").
5. **Quiz:** only if it does not exist (see "Creating a quiz").
6. **Check and verify** (see "Verification": run `check.py` first, then look at the slides), then report. Do **not** commit or push unless the user asks (they confirm every commit and push explicitly); never stage the source PDFs (`git add -A -- . ':!*.pdf'`).

## Deck conventions

Copy the `<head>`/script skeleton of `lectures/kanones-agoras/index.html` (change title, descriptions, canonical/og URLs to `/lectures/<slug>/`). Slide order:

1. **Title** (suit symbols, `<h1>` = topic title, `p.big` = «Ενότητα NN · <υπότιτλος>», club name, note about navigation; no credit line with a name).
2. **«Τι θα δούμε»** – numbered list of the summary's sections + the example/quiz teaser box.
3. **«Τι χρειάζεσαι από πριν»** – 3 bullets recalling the concepts needed, with links to the units that cover them (skip for unit 01).
4. **Content slides**, grouped by the summary's sections; each slide starts with `<div class="kicker">K · Τίτλος ενότητας</div>`. One idea per slide: short bullets (≤ 4–5), then an `.example` box or a diagram. After a rule, add a "Τι παίζεις; / Ποιος κερδίζει; / Τι έγινε;" practice slide whose answer is hidden in a `class="fragment answer"` block.
5. **«Συνοψίζοντας»** (`ul.recap`) – one bullet per section.
6. **«Τι ακολουθεί»** – bullets + exactly two buttons: `<a class="btnlink" href="../../quiz/<slug>/">Κουίζ NN</a>` and `<a class="btnlink alt" href="../a-kyklos/">← Α κύκλος Μαθημάτων</a>` (nothing else: no previous / next unit, no club-lessons link). State the number of quiz questions (count them, see below).

Target ≈ 22–28 slides. Every slide must fit in 1280×720 (and 720×1280 portrait); if one overflows, split it or trim text — don't shrink fonts.

Building blocks (all styled in `lectures/deck.css`; add new CSS there, never inline big styles, and add a `.portrait` variant if the block is a multi-column grid):

- Layout: `.cols` / `.cols.even` (two columns), `.example` (adds the «Παράδειγμα» label), `.note`, `.center`, `.big`.
- Cards: `<span class="pc">♠K</span>` (+ `red` for ♥♦, sizes `sm`/`xs`, `on` highlight, `dim`, `ghost` for a not-yet-played seat); hand by suit: `.hand` (see the slide «Παράδειγμα: ένα χέρι» in `vasika-tou-mpritz`); bonus colours on `.ladder td.g/.b/.p/.y` and the `.bonus` legend (see `epilogi-symvolaiou`).
- Table diagrams: `.compass` (roles: `.seat.n/.e/.s/.w` with `ax1` N–S blue / `ax2` E–W purple, `.tag` = role pill, `.tag.def` = opening lead), `.trick` (one trick: each `.seat` has `<b>` name, `.pc`, `<i>` order), `.pile`.
- Auction: `table.auction` with header order **Δύση, Βορράς, Ανατολή, Νότος**; leave leading cells empty so the dealer sits in his column; mark the closing passes with `class="end"` (yellow).
- Bidding: `.bidbox` + `.bid` (`.pass`, `.ok`, `.no`), `.ladder` (35 bids), `.cmp` (compare two bids), `.counts`, `.need` (generic table; `.key`, `.ok`, `.bad`), `.outcomes`/`.oc`, `.rules`/`.rule`, `.flow`, `.suits`, `.trump-pill`.
- `class="fragment"` on cells/blocks reveals them step by step; answers always go in `.fragment.answer`.

Text rules:

- **Red suits:** wrap ♥ and ♦ in `<span class="rs">♥</span>` in running text (inside `.pc.red`/`.hand .suit.red` use `red`). ♠ ♣ stay plain.
- **ΧΑ (no trump) must be typed with Greek letters Χ and Α**, never Latin X A. After writing, run a grep for mixed-script `XA|ΧA|XΑ`.
- Vocabulary used on the site (keep it): εκτελεστής, μορ, αντάμ, αμυνόμενοι, άξονας, λεβέ (= μπάζα), ατού, ΧΑ, τσάκα, ονέρ / λιμά, μαζέρ / μινέρ, συμβόλαιο, δέσμευση, θήκη (ντόνα/διανομή), κουτί αγορών, πάσο, «το έβγαλε ακριβώς», «το έβγαλε με N άνω λεβέ», «μπήκε μέσα (N λεβέ κάτω)». **dealer** and **bridgemate** stay in Latin letters. **Grammar (the owner insists):** η μανς (η χαμηλότερη μανς), η λεβέ / οι λεβέ, η αντάμ; bids take the article of the suit's name: η 1♥ / οι 4♥ / οι 4♠ (κούπες, πίκες: feminine), το 1♣ / τα 3♣ / τα 4♦ (σπαθιά, καρά: neuter), το 1ΧΑ / τα 3ΧΑ (ΧΑ: neuter plural). Example: «οι 4♥ είναι μανς», «τα 4♦ είναι μερικό σκορ», «Για τις 4♠…». When in doubt, write «η αγορά 4♥» or «το συμβόλαιο 4♥». Don't introduce new terminology that the summary doesn't use. Things the summary only counts but defers are **not named at all** in the lectures: the remaining bidding-box calls (X/κοντρ, XX/ρεκοντρ) and the 2 helper cards (STOP, ALERT) — only the pass is mentioned ("οι υπόλοιπες δηλώσεις και οι βοηθητικές δεν θα μας χρειαστούν για τώρα"). Likewise for anything else the user says is out of scope.
- Address the learner informally (singular «δες», «δοκίμασε»), as in lecture 1/2.
- Table conventions: clockwise order is Β → Α → Ν → Δ → Β, so the player **to the left of** X is the next one clockwise (left of Νότος = Δύση, left of Δύση = Βορράς, left of Βορράς = Ανατολή, left of Ανατολή = Νότος). Declarer's left-hand opponent makes the opening lead.
- **Check every example for correctness** before finishing: auctions are legal (each call higher than the previous, ends with 3 passes or 4 at the start), the declarer is the first of the *axis* to bid the final denomination, tricks needed = level + 6, who wins each trick, etc. Prefer examples that don't contradict a "usually" rule of the summary (e.g. don't pick an honor-on-honor example that clashes with "second hand low" in a confusing way).
- Derived facts (e.g. defenders need 8 − level tricks) are fine if they follow directly from the summary; don't add bridge theory that isn't in it.

## Wiring (after the deck exists)

- `lectures/a-kyklos/index.html` (the «Α κύκλος Μαθημάτων» list): add a `<a class="res" href="../<slug>/">` row (copy an existing one: thumbnail `<span class="thumb">` with 2-4 `<span class="tc">` cards that hint at the topic; write notrump as «ΝΤ» on these thumbnails (1ΝΤ, 3ΝΤ), not «ΧΑ»; use `tc big` for a single large card, never `tc lg`, `<p class="meta">Ενότητα NN · <slide count> διαφάνειες</p>`, `<h3>` title, one-sentence description, `<span class="go">Δείτε τις διαφάνειες →</span>`; rows stay in unit order). Slide count = `grep -c "<section" lectures/<slug>/index.html`. Update the quiz links in the note at the bottom (labels «Κουίζ NN»).
- `assets/site.js`: add `{ slug: '<slug>', title: '<τίτλος>', kw: '<λέξεις για την αναζήτηση>' }` to `SITE.cycles[0].units` (the sidebar «Μαθήματα → Α κύκλος» / «Quiz → Α' κύκλος» and the search are built from it; position = unit number).
- `sitemap.xml`: add `https://learn.heraklion-bridge.gr/lectures/<slug>/` after the previous lecture.
- The deck's back links (`.deck-back` and the last-slide button) go to `../a-kyklos/`; the deck copied from an existing one already has them.
- `README.md` already says `lectures/<slug>/`; update it only if something structural changed.
- Home `index.html` and the hubs `lectures/index.html` / `quiz/index.html` (they list the cycles, not the units) are generic and need no change. A new *cycle* is a different job: new entry in `SITE.cycles`, a folder like `lectures/a-kyklos/` and `quiz/a-kyklos/`, and a row in both hubs.
- The site has two audiences: **students** («Μαθήματα» = `/lectures/`, «Quiz» = `/quiz/`: everything this skill produces by default; the old `/mathites/` address only redirects to the home page) and **players** (`/paiktes/`, for people who finished the courses or play already). Material for players is organised by topic in `paiktes/<thema>/` (see "Players' material" below); do not put it in `lectures/` or `quiz/`.

## Creating a quiz (only if `quiz/<slug>/` does not exist)

1. `cp -r quiz/epilogi-symvolaiou quiz/<slug>`; in `index.html` replace the title / description / canonical / og URL / the link to the deck (no lesson number, see «Naming»); delete the `<p class="quiz-note">` paragraph, quiz pages carry no extra links (the only links are the `.crumbs` back link to `../a-kyklos/` and, on the result screen, the buttons rendered by `assets/quiz.js`); in `questions.js` replace the title comment and questions.
2. **Questions:** 18–21, Greek, 4 options, one correct. Cover each fact of the summary at least once, then add worked-example questions that reuse the board widgets: `auction`, `context`, `hand`, `fullhand`, `trump`, `trick` (documented at the top of `quiz/vasika-tou-mpritz/questions.js`). Write `correct: 0` as the right answer — the engine shuffles unless `shuffle: false` (use `false` whenever the options are Βορράς/Ανατολή/Νότος/Δύση or are ordered/numbered in a way that matters). `explain` always gives the reason, quoting the rule from the summary.
3. **No chain:** quizzes do not link to the next quiz, so `questions.js` has no `next` entry (the engine ignores it) and the previous quiz needs no change.
4. **Register it:** a row `<a class="res" href="../<slug>/">` in `quiz/a-kyklos/index.html` (meta «Ενότητα NN · N ερωτήσεις», N = number of questions), the sidebar entry in `assets/site.js` if the lecture step has not added it yet, and `sitemap.xml`. The home page and the hub `quiz/index.html` are generic (no counts) and need no change. The quiz page's `.crumbs` link goes to `../a-kyklos/`. Update the list of quizzes in `README.md`.
5. Question count: `grep -c "^    {" quiz/<slug>/questions.js` (each question object starts at 4-space indent) — cross-check with the number in the deck's last slide and the tiles.

## Players' material (`/paiktes/`) – only when the user says the PDF/text is for players

**Current state:** every button of `/paiktes/` is a greyed-out «Σύντομα» placeholder except the printable «Κάρτα συμβάσεων» (`paiktes/karta-symvaseon/`, no server; the sidebar group «Για παίκτες» is `SITE.players` in `assets/site.js`). The finished Συμβάσεις (20 pages) and Υλικό pages, with their CSS, are kept on the git branch `paiktes-content`; ask before publishing them. Plan: the players' area has four sections: **Διανομές** (deals), **Συμβάσεις** (conventions, split Απλές / Προχωρημένες), **Κουίζ**, **Υλικό** (links and reading). Folders: `paiktes/dianomes/`, `paiktes/symvaseis/<slug>/`, `paiktes/kouiz/`, `paiktes/yliko/`. Not-yet-built sections are `quiz-tile soon` placeholders in `paiktes/index.html`: when you build one, turn its tile into a link, add it to the "Για παίκτες" menu in `assets/site.js` and to `sitemap.xml`, and mention it in `README.md`.

- **Conventions:** plain HTML pages (copy `paiktes/symvaseis/stayman/`), bidding trees as `table.seq` (see README), title with a `level-tag`, crumbs link back to the list, and an entry in the right list of `paiktes/symvaseis/index.html`. Keep the system's own abbreviations (GF, SI, SGL, to play, sign-off; legend on that page) and write ΧΑ in Greek letters. Translate from the user's source faithfully; do not "fix" bridge content that looks odd, list it for the user instead. Players' pages may use κοντρ/ρεκοντρ (the "leave out X/XX" rule above is only for the first-cycle lectures).
- **Slides/quizzes for players:** same conventions as the student ones, in `paiktes/<section>/<topic>/` (fix the relative paths, `../../../lectures/deck.css`, `../../../assets/…`). Don't use "Α΄ κύκλος · Μάθημα N" on the title slide; use the topic name and a level label (Μεσαίο / Προχωρημένο) if the user gives one. Skip the "Από το προηγούμενο μάθημα" slide unless the topic clearly builds on a lesson. Assume the learner knows the first-cycle vocabulary.
- **Inspiration from other sites** (e.g. the user's friend's blog bridgeaddiction.blogspot.com): rewrite in your own words, never copy text, and credit/link the source on the page.

## Verification

First run the automatic checks (no teacher name or lesson numbers, ΧΑ typed in Greek, grammar of bids / η μανς / η λεβέ / η αντάμ, links, unit numbering, slide and question counts vs. the list rows, sidebar entry, sitemap) and fix every FAIL:

```bash
python3 .claude/skills/lecture-from-summary/check.py <slug>
```

Then look at it. Statistics (GoatCounter, `assets/stats.js`) are loaded automatically by `site.js` and `deck.js` and need no per-unit work; localhost is ignored by GoatCounter.

```bash
cd <repo> && python3 -m http.server 8123   # run in background
```

Open `http://localhost:8123/lectures/<slug>/` in the Browser pane, resize to 1280×720, then for each slide run in the page console:

```js
Reveal.configure({transition:'none'}); Reveal.slide(i, 0, 99)   // 99 = show all fragments
```

wait ~1 s (screenshots otherwise show the previous slide), take a screenshot at scale 0.6 and look for overflow, cropped boxes and wrong highlights. Overflow check for all slides at once (every value should stay below ~700 in landscape):

```js
(async()=>{const chk=s=>Math.max(...[...s.children].map(c=>c.offsetTop+c.offsetHeight));const o=[];for(let i=0;i<Reveal.getTotalSlides();i++){Reveal.slide(i,0,99);await new Promise(r=>setTimeout(r,200));o.push((i+1)+':'+chk(Reveal.getCurrentSlide()))}return o.join(' ')})()
```

Then `resize_window` preset `mobile`, reload, and spot-check 2–3 slides with grids (tables, `.rules`, `.outcomes`). Reset the viewport with preset `desktop` and stop the server when done. For a quiz, open `quiz/<slug>/` and click through a few questions incl. the board widgets.

## Final report to the user

Say what was created (deck path, slide count, quiz created or reused), which existing files were touched (lectures index, quiz index, sitemap, previous deck, README, …), the `check.py` result, and **everything that was ambiguous, derived or added beyond the summary** (the teacher forwards the link to students and is wary of surprises). Give the local URLs, say that nothing was committed, and ask before committing/pushing (without the PDFs). After the push, remind that GitHub Pages needs a few minutes.
