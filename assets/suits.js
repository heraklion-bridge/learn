/* ==========================================================================
   Σύμβολα τράπουλας στα πεδία κειμένου (Κάρτα συμβάσεων, Συστήματα).
     HBSuits.init(root, { bid: 'css-selector' })
     HBSuits.help(extraLines) → μία γραμμή με τα γρήγορα σύμβολα και ένα κρυμμένο «?» με τα αναλυτικά παραδείγματα (στοιχείο προς εισαγωγή στη σελίδα)
   • Όταν πατάτε μέσα σε πεδίο κειμένου, εμφανίζεται κοντά του μια μικρή παλέτα: ♠ ♥ ♦ ♣ και NT.
   • Ελληνικά: γράψτε τα δύο πρώτα γράμματα και πατήστε κενό, και γίνεται η αντικατάσταση
     (σπ → ♣ σπαθιά, κα → ♦ καρά, κο → ♥ κούπες, μπ → ♠ μπαστούνια, χα ή ντ → NT, πα ή πά → PASS).
     Δουλεύει μόνο όταν το κομμάτι είναι ολόκληρη λέξη ή ακολουθεί αριθμό: «1σπ » → 1♣, «3χα » → 3NT.
   • Αγγλικά: !s !h !d !c → ♠ ♥ ♦ ♣ (αμέσως). Στα πεδία που ταιριάζουν με το `bid` (π.χ. το πεδίο «Δήλωση»)
     αρκεί το επίπεδο και το γράμμα: 1s → 1♠, 2h → 2♥, 3d → 3♦, 4c → 4♣, 1nt → 1NT.
   ========================================================================== */
window.HBSuits = (function () {
  'use strict';
  var SYM = { s: '♠', h: '♥', d: '♦', c: '♣' };
  var MAP = {};
  [['s', 'sS'], ['h', 'hH'], ['d', 'dD'], ['c', 'cC']].forEach(function (x) {
    x[1].split('').forEach(function (ch) { MAP[ch] = x[0]; });
  });
  var LETTERS = Object.keys(MAP).join('');
  var RE_BANG = new RegExp('!([' + LETTERS + '])', 'g');
  var RE_BID = new RegExp('([1-7])\\s?([' + LETTERS + '])', 'g');
  var RE_NT = /([1-7])\s?[nN][tT]/g;
  var GREEK = { 'σπ': '♣', 'κα': '♦', 'κο': '♥', 'μπ': '♠', 'χα': 'NT', 'ντ': 'NT', 'πα': 'PASS', 'πά': 'PASS' };   // τα δύο πρώτα γράμματα + κενό
  var RE_GREEK = /(^|[^A-Za-zΑ-Ωα-ωΆ-ώ])([Α-Ωα-ωΆ-ώ]{2})$/;

  function conv(t, bid) {
    t = t.replace(RE_BANG, function (m, l) { return SYM[MAP[l]]; });
    if (bid) {
      t = t.replace(RE_BID, function (m, n, l) { return n + SYM[MAP[l]]; });
      t = t.replace(RE_NT, '$1NT');
    }
    return t;
  }
  function greek(before) {               // «…1σπ» → «…1♣» (το κενό μόλις πληκτρολογήθηκε)
    var m = RE_GREEK.exec(before);
    var rep = m && GREEK[m[2].toLowerCase()];
    return rep ? before.slice(0, m.index + m[1].length) + rep : null;
  }
  function apply(input, bid, spaceTyped) {   // μετατροπή με σωστή θέση του δρομέα
    var v = input.value, pos = input.selectionStart;
    if (pos == null) pos = v.length;
    var before = v.slice(0, pos), after = v.slice(pos);
    if (spaceTyped && before.slice(-1) === ' ') {
      var rep = greek(before.slice(0, -1));
      if (rep !== null) before = rep + ' ';
    }
    before = conv(before, bid); after = conv(after, bid);
    if (before + after === v) return;
    input.value = before + after;
    try { input.setSelectionRange(before.length, before.length); } catch (e) { /* τίποτα */ }
  }
  function insertAt(input, text) {
    var s = input.selectionStart == null ? input.value.length : input.selectionStart;
    var e = input.selectionEnd == null ? s : input.selectionEnd;
    input.value = input.value.slice(0, s) + text + input.value.slice(e);
    input.setSelectionRange(s + text.length, s + text.length);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function init(root, opts) {
    opts = opts || {};
    var cur = null, hideTimer;
    var bar = document.createElement('div');
    bar.className = 'hb-suits';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Σύμβολα τράπουλας');
    bar.hidden = true;
    [['♠', 'Μπαστούνια (μπ + κενό, ή !s)'], ['♥', 'Κούπες (κο + κενό, ή !h)'], ['♦', 'Καρά (κα + κενό, ή !d)'], ['♣', 'Σπαθιά (σπ + κενό, ή !c)'], ['NT', 'Χωρίς ατού (χα ή ντ + κενό)']].forEach(function (x) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cc-sym' + (x[0] === '♥' || x[0] === '♦' ? ' rs' : '') + (x[0] === 'NT' ? ' nt' : '');
      b.textContent = x[0];
      b.title = x[1];
      b.setAttribute('aria-label', 'Εισαγωγή: ' + x[1]);
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });   // το πεδίο κρατά την εστίαση
      b.addEventListener('click', function () {
        if (!cur || !document.body.contains(cur)) return;
        cur.focus();
        insertAt(cur, x[0]);
      });
      bar.appendChild(b);
    });
    document.body.appendChild(bar);

    function isField(t) {
      return !!t && root.contains(t) && ((t.tagName === 'INPUT' && t.type === 'text') || t.tagName === 'TEXTAREA');
    }
    function place() {
      if (!cur || !document.body.contains(cur)) { bar.hidden = true; return; }
      var r = cur.getBoundingClientRect(), vv = window.visualViewport;
      var vh = vv ? vv.height : window.innerHeight, vw = vv ? vv.width : window.innerWidth;
      var vt = vv ? vv.offsetTop : 0, vl = vv ? vv.offsetLeft : 0;
      if (r.bottom < vt || r.top > vt + vh) { bar.style.visibility = 'hidden'; return; }
      bar.hidden = false; bar.style.visibility = '';
      var bh = bar.offsetHeight || 46, bw = bar.offsetWidth || 260;
      var top = r.bottom + 6;
      if (top + bh > vt + vh - 4) top = Math.max(vt + 4, r.top - bh - 6);   // δεν χωράει από κάτω: πάνω από το πεδίο
      var left = Math.max(vl + 4, Math.min(r.left, vl + vw - bw - 4));
      bar.style.top = top + 'px'; bar.style.left = left + 'px';
    }
    // η μετατροπή γίνεται πριν τους δικούς σας χειριστές (capture), ώστε να βλέπουν ήδη το σωστό κείμενο
    root.addEventListener('input', function (e) {
      if (isField(e.target)) apply(e.target, !!(opts.bid && e.target.matches(opts.bid)), e.data === ' ');
    }, true);
    root.addEventListener('focusin', function (e) {
      if (!isField(e.target)) return;
      clearTimeout(hideTimer);
      cur = e.target; place();
    });
    root.addEventListener('focusout', function () {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { if (!isField(document.activeElement)) { bar.hidden = true; cur = null; } }, 150);
    });
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    if (window.visualViewport) { window.visualViewport.addEventListener('resize', place); window.visualViewport.addEventListener('scroll', place); }
    root.addEventListener('input', function () { if (cur) place(); });
    window.addEventListener('beforeprint', function () { bar.hidden = true; });
  }

  /* Μία γραμμή με τα γρήγορα σύμβολα και ένα «?» που ανοίγει όλες τις οδηγίες. */
  function help(extra) {
    function node(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
    var box = node('div', 'cc-help');
    var quick = node('span', 'cc-quick', 'Σύμβολα: ');
    ['σπ', 'κα', 'κο', 'μπ', 'χα', 'πα'].forEach(function (k) { quick.appendChild(node('b', '', k)); quick.appendChild(document.createTextNode(' ')); });
    quick.appendChild(document.createTextNode('+ κενό'));
    var id = 'cc-help-' + Math.random().toString(36).slice(2, 8);
    var q = node('button', 'cc-q', '?');
    q.type = 'button'; q.title = 'Οδηγίες και παραδείγματα';
    q.setAttribute('aria-label', 'Οδηγίες και παραδείγματα'); q.setAttribute('aria-expanded', 'false'); q.setAttribute('aria-controls', id);
    var body = node('div', 'cc-help-body'); body.id = id; body.hidden = true;
    body.appendChild(node('h3', '', 'Σύμβολα τράπουλας'));
    var ul = node('ul');
    ['Πατήστε μέσα σε ένα πεδίο: από κάτω του εμφανίζεται μια μικρή μπάρα με ♠ ♥ ♦ ♣ NT.',
     'Γράψτε τα δύο πρώτα γράμματα και πατήστε κενό: σπ → ♣ (σπαθιά), κα → ♦ (καρά), κο → ♥ (κούπες), μπ → ♠ (μπαστούνια), χα ή ντ → NT, πα ή πά → PASS.',
     'Παραδείγματα: «1σπ » → 1♣ · «3χα » → 3NT · «πα » → PASS · «Αντάμ έναντι χα » → «Αντάμ έναντι NT».',
     'Αγγλικά: !s !h !d !c → ♠ ♥ ♦ ♣ (αμέσως).'].concat(extra || []).forEach(function (t) { ul.appendChild(node('li', '', t)); });
    body.appendChild(ul);
    q.addEventListener('click', function () {
      var open = body.hidden;
      body.hidden = !open;
      q.setAttribute('aria-expanded', String(open));
      q.classList.toggle('on', open);
    });
    box.appendChild(quick); box.appendChild(q); box.appendChild(body);
    return box;
  }

  return { init: init, convert: conv, help: help };
})();
