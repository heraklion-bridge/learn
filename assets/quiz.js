/* Κουίζ – η λογική του παιχνιδιού.
   Οι ερωτήσεις κάθε κουίζ βρίσκονται στο αρχείο questions.js του αντίστοιχου φακέλου (π.χ. quiz/vasika-tou-mpritz/questions.js). */
(function () {
  'use strict';

  var root = document.getElementById('quiz');
  if (!root || typeof QUIZ === 'undefined') return;

  var script = document.currentScript;
  var ROOT = script ? script.src.replace(/assets\/quiz\.js(\?.*)?$/, '') : '/';

  var SEAT = { N: 'Βορράς', E: 'Ανατολή', S: 'Νότος', W: 'Δύση' };
  var NEXT = { N: 'E', E: 'S', S: 'W', W: 'N' };
  var SEAT_ORDER = ['W', 'N', 'E', 'S'];
  var SUIT_ONE = { '♠': 'πίκα', '♥': 'κούπα', '♦': 'καρό', '♣': 'σπαθί' };
  var SUIT_PL = { '♠': 'πίκες', '♥': 'κούπες', '♦': 'καρά', '♣': 'σπαθιά' };
  var RANK = { A: 'Άσος', K: 'Ρήγας', Q: 'Ντάμα', J: 'Βαλές' };
  var LETTERS = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ'];

  var state;

  /* ---------- helpers ---------- */
  // Κείμενο στο οποίο οι κούπες και τα καρά (♥ ♦) εμφανίζονται με κόκκινο χρώμα
  function rich(text) {
    var f = document.createDocumentFragment();
    String(text).split(/([♥♦])/).forEach(function (part) {
      if (part === '♥' || part === '♦') {
        var s = document.createElement('span');
        s.className = 'rs';
        s.textContent = part;
        f.appendChild(s);
      } else if (part) {
        f.appendChild(document.createTextNode(part));
      }
    });
    return f;
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'rich') e.appendChild(rich(attrs[k]));
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function prepare(q) {
    var order = q.options.map(function (_, i) { return i; });
    if (q.shuffle !== false) shuffle(order);
    return { q: q, order: order };
  }

  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---------- ανώνυμα στατιστικά (βλ. assets/stats.js) ---------- */
  var SLUG = location.pathname.replace(/\/$/, '').split('/').pop();
  function track(name) { if (window.trackEvent) window.trackEvent(name + '/' + SLUG); }

  /* ---------- state ---------- */
  function start() {
    state = {
      mode: 'quiz',
      cur: 0,
      items: QUIZ.questions.map(prepare),
      answers: QUIZ.questions.map(function () { return null; }),
      started: false,
      reported: false
    };
    render();
  }

  function counts() {
    var answered = 0, correct = 0;
    state.answers.forEach(function (a, i) {
      if (a !== null) { answered++; if (a === state.items[i].q.correct) correct++; }
    });
    return { answered: answered, correct: correct };
  }

  function statusOf(i) {
    var a = state.answers[i];
    if (a === null) return 'none';
    return a === state.items[i].q.correct ? 'correct' : 'wrong';
  }

  /* ---------- pieces of a question ---------- */
  function card(code) {
    var suit = code.charAt(0), rank = code.slice(1);
    var red = suit === '♥' || suit === '♦';
    var name = (RANK[rank] || rank) + ' ' + (SUIT_ONE[suit] || '');
    return el('span', { class: 'pcard' + (red ? ' red' : ''), 'aria-label': name, title: name, text: suit + rank });
  }

  function trickTable(q) {
    var seats = ['N', 'W', 'E', 'S'];
    var wrap = el('div', { class: 'trick', role: 'group', 'aria-label': 'Τα φύλλα που παίχτηκαν στη λεβέ' });
    var order = [], s = q.trick.lead;
    for (var k = 0; k < 4; k++) { order.push(s); s = NEXT[s]; }
    seats.forEach(function (p) {
      var n = order.indexOf(p) + 1;
      wrap.appendChild(el('div', { class: 'seat seat-' + p }, [
        el('span', { class: 'seat-name', text: SEAT[p] }),
        card(q.trick.cards[p]),
        el('span', { class: 'seat-order', text: n === 1 ? 'άνοιξε' : n + 'ος' })
      ]));
    });
    wrap.appendChild(el('div', { class: 'trick-center', 'aria-hidden': 'true', text: 'λεβέ' }));
    return wrap;
  }

  function auctionTable(a) {
    var table = el('table', { class: 'auction' });
    table.appendChild(el('caption', { text: 'Η αγορά (με τη σειρά που έγιναν οι δηλώσεις)' }));
    var head = el('tr');
    SEAT_ORDER.forEach(function (p) { head.appendChild(el('th', { scope: 'col', text: SEAT[p] + (p === a.dealer ? ' (dealer)' : '') })); });
    table.appendChild(el('thead', {}, [head]));
    var cells = [];
    for (var i = 0; i < SEAT_ORDER.indexOf(a.dealer); i++) cells.push('');
    cells = cells.concat(a.calls);
    var body = el('tbody');
    for (var r = 0; r < cells.length; r += 4) {
      var tr = el('tr');
      for (var c = 0; c < 4; c++) tr.appendChild(el('td', { rich: cells[r + c] || '' }));
      body.appendChild(tr);
    }
    table.appendChild(body);
    return table;
  }

  function handBox(h) {
    var row = el('div', { class: 'hand' }, [el('span', { class: 'hand-label', text: h.label })]);
    h.cards.forEach(function (c) { row.appendChild(card(c)); });
    return row;
  }

  // ολόκληρο χέρι ανά χρώμα: [['♠', ['K', 'Q', '5']], ['♥', []], ...]  (άδεια λίστα = κανένα φύλλο)
  function fullHandBox(rows) {
    var box = el('div', { class: 'fullhand', role: 'group', 'aria-label': 'Τα φύλλα σου ανά χρώμα' });
    rows.forEach(function (row) {
      var suit = row[0], ranks = row[1];
      box.appendChild(el('span', { class: 'fh-suit' + (suit === '♥' || suit === '♦' ? ' red' : ''), 'aria-label': SUIT_PL[suit], text: suit }));
      var cell = el('span', { class: 'fh-cards' });
      if (!ranks.length) cell.appendChild(el('span', { class: 'fh-void', text: '— (κανένα φύλλο)' }));
      ranks.forEach(function (r) { cell.appendChild(card(suit + r)); });
      box.appendChild(cell);
    });
    return box;
  }

  function trumpLabel(t) {
    return t === 'NT' ? 'Χωρίς ατού (NT)' : 'Ατού: ' + t + ' (' + SUIT_PL[t] + ')';
  }

  function questionExtras(q) {
    var out = [];
    if (q.context) out.push(el('p', { class: 'context', rich: q.context }));
    if (q.auction) out.push(auctionTable(q.auction));
    if (q.hand) out.push(handBox(q.hand));
    if (q.fullhand) out.push(fullHandBox(q.fullhand));
    if (q.trump) out.push(el('p', { class: 'trump', rich: trumpLabel(q.trump) }));
    if (q.trick) out.push(trickTable(q));
    return out;
  }

  /* ---------- question number boxes ---------- */
  function qnav(onClick, currentIdx) {
    var nav = el('div', { class: 'qnav', role: 'group', 'aria-label': 'Πλοήγηση στις ερωτήσεις' });
    state.items.forEach(function (it, i) {
      var st = statusOf(i);
      var label = st === 'none' ? 'αναπάντητη' : (st === 'correct' ? 'σωστή' : 'λάθος');
      var b = el('button', {
        type: 'button',
        class: 'qbox' + (st === 'none' ? '' : ' ' + st) + (i === currentIdx ? ' current' : ''),
        'aria-label': 'Ερώτηση ' + (i + 1) + ', ' + label,
        title: 'Ερώτηση ' + (i + 1) + ': ' + label
      }, [
        el('span', { text: String(i + 1) }),
        el('span', { class: 'qmark', 'aria-hidden': 'true', text: st === 'correct' ? '✓' : (st === 'wrong' ? '✗' : '') })
      ]);
      if (i === currentIdx) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', function () { onClick(i); });
      nav.appendChild(b);
    });
    return nav;
  }

  function legend() {
    return el('p', { class: 'qlegend' }, [
      el('span', { class: 'lg lg-correct', text: '✓ σωστή' }),
      el('span', { class: 'lg lg-wrong', text: '✗ λάθος' }),
      el('span', { class: 'lg lg-none', text: 'αναπάντητη' })
    ]);
  }

  /* ---------- navigation ---------- */
  function goTo(i, focus) {
    state.mode = 'quiz';
    state.cur = i;
    render(focus || 'heading');
    root.scrollIntoView({ block: 'start' });
  }

  function finish() {
    if (!state.reported) {
      state.reported = true;
      var c = counts();
      track('quiz-finish');
      if (window.trackEvent) window.trackEvent('quiz-score/' + SLUG + '/' + c.correct + '-of-' + state.items.length);
    }
    state.mode = 'result';
    render('heading');
    root.scrollIntoView({ block: 'start' });
  }

  /* ---------- question screen ---------- */
  function render(focus) {
    if (state.mode === 'result') { renderResult(); focusIn(focus); return; }

    var n = state.items.length, i = state.cur;
    var item = state.items[i], q = item.q, chosen = state.answers[i];
    var c = counts();

    var cardEl = el('div', { class: 'quiz-card' });
    cardEl.appendChild(el('div', { class: 'quiz-count',
      text: 'Ερώτηση ' + (i + 1) + ' από ' + n + '  ·  Απαντημένες: ' + c.answered + '  ·  Σωστές: ' + c.correct }));
    cardEl.appendChild(qnav(function (j) { goTo(j); }, i));
    cardEl.appendChild(legend());

    cardEl.appendChild(el('h2', { class: 'quiz-q', id: 'quiz-q', rich: q.q }));
    questionExtras(q).forEach(function (x) { cardEl.appendChild(x); });

    var list = el('div', { class: 'quiz-options', role: 'group', 'aria-labelledby': 'quiz-q' });
    item.order.forEach(function (orig, pos) {
      var b = el('button', { type: 'button', class: 'opt' }, [
        el('span', { class: 'opt-letter', 'aria-hidden': 'true', text: LETTERS[pos] }),
        el('span', { class: 'opt-text', rich: q.options[orig] }),
        el('span', { class: 'opt-mark', 'aria-hidden': 'true' })
      ]);
      if (chosen !== null) {
        b.disabled = true;
        if (orig === q.correct) { b.classList.add('correct'); b.querySelector('.opt-mark').textContent = '✓'; }
        else if (orig === chosen) { b.classList.add('wrong'); b.querySelector('.opt-mark').textContent = '✗'; }
      } else {
        b.addEventListener('click', function () {
          state.answers[i] = orig;
          if (!state.started) { state.started = true; track('quiz-start'); }
          render('next');
        });
      }
      list.appendChild(b);
    });
    cardEl.appendChild(list);

    var feedback = el('div', { class: 'quiz-feedback', role: 'status', 'aria-live': 'polite' });
    if (chosen !== null) {
      var ok = chosen === q.correct;
      feedback.className = 'quiz-feedback ' + (ok ? 'ok' : 'bad');
      feedback.appendChild(el('p', { class: 'verdict', rich: ok ? 'Σωστά!' : 'Λάθος. Η σωστή απάντηση είναι: ' + q.options[q.correct] }));
      feedback.appendChild(el('p', { rich: q.explain }));
    }
    cardEl.appendChild(feedback);

    // κουμπιά πλοήγησης: προηγούμενη / επόμενη (ή παράλειψη, αν δεν έχει απαντηθεί)
    var last = i === n - 1, answered = chosen !== null;
    var prev = el('button', { type: 'button', class: 'btn btn--outline', text: '← Προηγούμενη' });
    prev.disabled = i === 0;
    prev.addEventListener('click', function () { goTo(i - 1); });
    var nextLabel = last ? (answered ? 'Δείτε το αποτέλεσμα' : 'Ολοκλήρωση') : (answered ? 'Επόμενη →' : 'Παράλειψη →');
    var next = el('button', { type: 'button', class: 'btn js-next', text: nextLabel });
    next.addEventListener('click', function () { if (last) finish(); else goTo(i + 1); });
    cardEl.appendChild(el('div', { class: 'quiz-nav' }, [prev, next]));

    var done = el('button', { type: 'button', class: 'linkbtn', text: 'Ολοκλήρωση κουίζ και αποτέλεσμα' });
    done.addEventListener('click', finish);
    cardEl.appendChild(el('div', { class: 'quiz-finish' }, [done]));

    root.innerHTML = '';
    root.appendChild(cardEl);
    focusIn(focus);
  }

  function focusIn(focus) {
    if (focus === 'next') {
      var nb = root.querySelector('.js-next');
      if (nb) { nb.focus({ preventScroll: true }); nb.scrollIntoView({ block: 'nearest' }); }
    } else if (focus === 'heading') {
      var h = root.querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  /* ---------- result screen ---------- */
  function renderResult() {
    var n = state.items.length, c = counts(), unanswered = n - c.answered;
    var pct = c.correct / n;
    var msg = pct === 1 ? 'Άριστα! Όλες οι απαντήσεις σωστές.'
      : pct >= 0.8 ? 'Πολύ καλά! Έχετε κατανοήσει τα βασικά αυτής της ενότητας.'
      : pct >= 0.5 ? 'Καλή προσπάθεια! Ρίξτε μια ματιά στις επεξηγήσεις παρακάτω και δοκιμάστε ξανά.'
      : 'Μην απογοητεύεστε, χρειάζεται λίγη εξάσκηση. Διαβάστε τις επεξηγήσεις και δοκιμάστε ξανά.';

    var cardEl = el('div', { class: 'quiz-card quiz-result' }, [
      el('h2', { text: 'Αποτέλεσμα' }),
      el('p', { class: 'score', text: c.correct + ' / ' + n }),
      el('p', { text: msg })
    ]);

    if (unanswered > 0) {
      var firstOpen = statusIndexOf('none');
      var go = el('button', { type: 'button', class: 'btn', text: 'Πηγαίνετε στην πρώτη αναπάντητη' });
      go.addEventListener('click', function () { goTo(firstOpen); });
      cardEl.appendChild(el('div', { class: 'unanswered' }, [
        el('p', { text: 'Έχετε ' + plural(unanswered, 'αναπάντητη ερώτηση', 'αναπάντητες ερωτήσεις') + ' (δεν μετρούν στη βαθμολογία).' }),
        go
      ]));
    }

    cardEl.appendChild(el('p', { class: 'qnav-title', text: 'Πατήστε έναν αριθμό για να δείτε την αντίστοιχη ερώτηση:' }));
    cardEl.appendChild(qnav(function (j) { goTo(j); }, -1));
    cardEl.appendChild(legend());

    var wrong = state.items.filter(function (it, i) { return statusOf(i) === 'wrong'; });
    if (wrong.length) {
      var review = el('div', { class: 'review' }, [el('h3', { text: 'Ερωτήσεις που χρειάζονται επανάληψη' })]);
      wrong.forEach(function (it) {
        review.appendChild(el('div', { class: 'review-item' }, [
          el('p', { class: 'review-q', rich: it.q.q })
        ].concat(questionExtras(it.q), [
          el('p', { class: 'review-a', rich: 'Σωστή απάντηση: ' + it.q.options[it.q.correct] }),
          el('p', { class: 'review-e', rich: it.q.explain })
        ])));
      });
      cardEl.appendChild(review);
    }

    var again = el('button', { type: 'button', class: 'btn', text: 'Παίξτε ξανά' });
    again.addEventListener('click', function () { start(); root.scrollIntoView({ block: 'start' }); });
    var links = [again, el('a', { class: 'btn btn--outline', href: ROOT + 'quiz/a-kyklos/', text: "← Quiz Α' Κύκλου Μαθημάτων" })];
    cardEl.appendChild(el('div', { class: 'btn-row center' }, links));

    root.innerHTML = '';
    root.appendChild(cardEl);
  }

  function statusIndexOf(status) {
    for (var i = 0; i < state.items.length; i++) if (statusOf(i) === status) return i;
    return 0;
  }

  start();
})();
