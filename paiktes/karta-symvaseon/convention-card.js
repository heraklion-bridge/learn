/* ==========================================================================
   Κάρτα συμβάσεων – φόρμα, ζωντανή προεπισκόπηση, εκτύπωση / PDF.
   --------------------------------------------------------------------------
   Δεν υπάρχει διακομιστής: η κάρτα αποθηκεύεται αυτόματα στον περιηγητή (localStorage),
   και μπορεί να αποθηκευτεί ως αρχείο (.json), να ανοιχτεί από αρχείο ή να σταλεί με σύνδεσμο
   (τα δεδομένα μπαίνουν στο κομμάτι της διεύθυνσης μετά το #, που δεν στέλνεται πουθενά).

   Τι θα αλλάζετε συχνότερα, αμέσως από κάτω:
     • SECTIONS     → τα πεδία της φόρμας (στα ελληνικά).
     • CONV_GROUPS  → οι συμβάσεις ανά κατηγορία με τα τικ (τα ονόματα των συμβάσεων μένουν στα αγγλικά).
     • DEFAULTS     → οι «τυπικές τιμές» του κουμπιού «Συμπλήρωση με τυπικές τιμές».
   Ο χρήστης μπορεί επιπλέον να προσθέσει δικές του συμβάσεις από τη φόρμα.
   ========================================================================== */

var OTHER = 'Άλλο (γράψτε παρακάτω)';   // όταν επιλεγεί, εμφανίζεται πεδίο να γράψει ο χρήστης ό,τι θέλει

var SECTIONS = [
  { title: 'Το ζευγάρι', cols: 2, fields: [
    { id: 'p1', label: 'Παίκτης 1', type: 'text' },
    { id: 'p2', label: 'Παίκτης 2', type: 'text' },
    { id: 'system', label: 'Σύστημα', type: 'text', ph: 'π.χ. 5φ μαζέρ, 2/1, Acol' },
    { id: 'club', label: 'Όμιλος / διοργάνωση', type: 'text' }
  ] },
  { title: 'Ανοίγματα', cols: 2, fields: [
    { id: 'nt1', label: 'Άνοιγμα 1NT (πόντοι)', type: 'text', ph: 'π.χ. 15–17' },
    { id: 'nt2', label: 'Άνοιγμα 2NT (πόντοι)', type: 'text', ph: 'π.χ. 20–21' },
    { id: 'major', label: 'Άνοιγμα 1 σε μαζέρ', type: 'select', opts: ['5φ μαζέρ (5+ φύλλα)', '4φ μαζέρ (4+ φύλλα)', OTHER] },
    { id: 'minor', label: 'Άνοιγμα 1 σε μινέρ', type: 'select', opts: ['Μακρύτερο μινέρ', 'Καλύτερο μινέρ (3+ φύλλα)', OTHER] },
    { id: 'c2', label: 'Άνοιγμα 2♣', type: 'select', opts: ['Ισχυρό, αναγκαστικό', 'Φυσικό', OTHER] },
    { id: 'w2d', label: 'Άνοιγμα 2♦', type: 'select', opts: ['Αδύναμο (6 φύλλα)', 'Ισχυρό', 'Multi', 'Δεν παίζουμε', OTHER] },
    { id: 'w2h', label: 'Άνοιγμα 2♥', type: 'select', opts: ['Αδύναμο (6 φύλλα)', 'Ισχυρό', 'Δεν παίζουμε', OTHER] },
    { id: 'w2s', label: 'Άνοιγμα 2♠', type: 'select', opts: ['Αδύναμο (6 φύλλα)', 'Ισχυρό', 'Δεν παίζουμε', OTHER] },
    { id: 'pre3', label: 'Φραγμοί (επίπεδο 3 και πάνω)', type: 'text', ph: 'π.χ. 7 φύλλα, 5–9 πόντοι', wide: true }
  ] },
  { title: 'Απαντήσεις και παρεμβολές', fields: [
    { id: 'rNT', label: 'Απαντήσεις στο 1NT', type: 'text', ph: 'π.χ. Stayman, Jacoby Transfers' },
    { id: 'rMaj', label: 'Απαντήσεις στο 1 σε μαζέρ', type: 'text', ph: 'π.χ. 1NT = 6–9 πόντοι, ανέβασμα με 3 φύλλα' },
    { id: 'rMin', label: 'Απαντήσεις στο 1 σε μινέρ', type: 'text', ph: 'π.χ. πρώτα το 4φ μαζέρ' },
    { id: 'oc1', label: 'Παρεμβολή στο επίπεδο 1', type: 'text', ph: 'π.χ. 8–16 πόντοι, 5+ φύλλα' },
    { id: 'oc2', label: 'Παρεμβολή στο επίπεδο 2', type: 'text', ph: 'π.χ. 11–16 πόντοι, 5+ φύλλα' },
    { id: 'ocNT', label: 'Παρεμβολή 1NT', type: 'text', ph: 'π.χ. 15–18 πόντοι, στοπ' },
    { id: 'dbl', label: 'Double', type: 'text', ph: 'π.χ. Takeout· Negative Double έως 3♠' }
  ] },
  { title: 'Άμυνα και σινιάλα', cols: 2, fields: [
    { id: 'leadNT', label: 'Αντάμ έναντι NT', type: 'select', opts: ['4ο καλύτερο', '3ο και 5ο καλύτερο', OTHER] },
    { id: 'leadSuit', label: 'Αντάμ έναντι χρώματος', type: 'select', opts: ['4ο καλύτερο', '3ο και 5ο καλύτερο', OTHER] },
    { id: 'sigAtt', label: 'Σινιάλο διάθεσης', type: 'select', opts: ['Κανονικό (μεγάλο φύλλο = θέλω)', 'Ανάποδο (μικρό φύλλο = θέλω)', OTHER] },
    { id: 'sigCount', label: 'Αριθμητικό σινιάλο', type: 'select', opts: ['Κανονικό (μεγάλο–μικρό = ζυγός αριθμός)', 'Ανάποδο (μικρό–μεγάλο = ζυγός αριθμός)', OTHER] },
    { id: 'honors', label: 'Αντάμ από σύνθεση ονέρ', type: 'text', ph: 'π.χ. K από AK, Q από QJ' },
    { id: 'sigSuit', label: 'Σινιάλο προτίμησης χρώματος', type: 'text', ph: 'π.χ. Lavinthal, Smith echo' }
  ] }
];

// Οι κατηγορίες φαίνονται μόνο στη φόρμα· στην κάρτα και στο PDF οι συμβάσεις είναι μία λίστα.
var CONV_GROUPS = [
  ['Ανοίγματα και απαντήσεις', [
    ['splinter', 'Splinter'], ['jacoby2', 'Jacoby 2NT'], ['bergen', 'Bergen Raises'],
    ['inverted', 'Inverted Minors'], ['drury', 'Drury'], ['wjs', 'Weak Jump Shifts']
  ]],
  ['Μετά από άνοιγμα NT', [
    ['stayman', 'Stayman'], ['transfers', 'Jacoby Transfers'], ['texas', 'Texas Transfers'],
    ['puppet', 'Puppet Stayman'], ['smolen', 'Smolen'], ['minorstayman', 'Minor Suit Stayman'], ['rangeask', 'Range Ask']
  ]],
  ['Slam bidding', [
    ['blackwood', 'Blackwood'], ['gerber', 'Gerber'], ['cue', 'Cue Bids'], ['serious3', 'Serious 3NT'], ['dopi', 'DOPI / DEPO']
  ]],
  ['Παρεμβολές και Double', [
    ['negdbl', 'Negative Double'], ['takeout', 'Takeout Double'], ['support', 'Support Double'], ['responsive', 'Responsive Double'],
    ['michaels', 'Michaels Cue Bid'], ['unusual', 'Unusual 2NT'], ['lebensohl', 'Lebensohl'], ['landy', 'Landy']
  ]],
  ['Διάφορες', [
    ['checkback', 'Checkback'], ['fsf', 'Fourth Suit Forcing'], ['twoway', 'Two-Way Game Try']
  ]]
];
var CONVENTIONS = CONV_GROUPS.reduce(function (all, g) { return all.concat(g[1]); }, []);

var DEFAULTS = {
  p1: 'Παίκτης 1', p2: 'Παίκτης 2', system: '5φ μαζέρ, 1NT 15–17', club: 'Όμιλος Μπριτζ Ηρακλείου',
  nt1: '15–17', nt2: '20–21', major: '5φ μαζέρ (5+ φύλλα)', minor: 'Μακρύτερο μινέρ', c2: 'Ισχυρό, αναγκαστικό', w2d: 'Αδύναμο (6 φύλλα)', w2h: 'Αδύναμο (6 φύλλα)', w2s: 'Αδύναμο (6 φύλλα)',
  pre3: '7 φύλλα, 5–9 πόντοι',
  rNT: 'Stayman, Jacoby Transfers', rMaj: '1NT = 6–9 πόντοι, ανέβασμα με 3 φύλλα', rMin: 'Πρώτα το 4φ μαζέρ',
  oc1: '8–16 πόντοι, 5+ φύλλα', oc2: '11–16 πόντοι, 5+ φύλλα', ocNT: '15–18 πόντοι, στοπ', dbl: 'Takeout· Negative Double έως 3♠',
  leadNT: '4ο καλύτερο', leadSuit: '4ο καλύτερο', sigAtt: 'Ανάποδο (μικρό φύλλο = θέλω)', sigCount: 'Ανάποδο (μικρό–μεγάλο = ζυγός αριθμός)',
  honors: 'K από AK, Q από QJ', sigSuit: 'Lavinthal',
  conv: { stayman: '', transfers: '', blackwood: '1430', negdbl: 'έως 3♠', takeout: '', michaels: '', unusual: '', jacoby2: '' }
};

/* ==========================================================================
   Από εδώ και κάτω: ο κώδικας. Δεν χρειάζεται αλλαγή.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'hbc-convention-card-v1';
  var MAX_CUSTOM = 30;
  var root = document.getElementById('cc');
  var state = {};          // id -> κείμενο, 'c:<σύμβαση>' -> '1'/'', 'n:<σύμβαση>' -> σημείωση, 'custom' -> JSON λίστα, 'notes' -> σημειώσεις
  var backup;              // υπενθύμιση αντιγράφου ασφαλείας (assets/backup.js)
  var shared = false;      // true όταν βλέπουμε κάρτα από σύνδεσμο (δεν αποθηκεύεται αυτόματα)

  /* ---------- βοηθητικά ---------- */
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function rich(parent, text) {          // κείμενο με ♥ ♦ σε κόκκινο
    String(text).split(/([♥♦])/).forEach(function (part) {
      if (part === '♥' || part === '♦') parent.appendChild(el('span', { class: 'rs', text: part }));
      else if (part) parent.appendChild(document.createTextNode(part));
    });
    return parent;
  }
  var knownKeys = (function () {
    var k = { notes: 1, custom: 1 };
    SECTIONS.forEach(function (s) { s.fields.forEach(function (f) { k[f.id] = 1; if (f.type === 'select') k['o:' + f.id] = 1; }); });
    CONVENTIONS.forEach(function (c) { k['c:' + c[0]] = 1; k['n:' + c[0]] = 1; });
    return k;
  })();
  function parseCustom(str) {            // [{n: όνομα, t: σημείωση}], πάντα καθαρή λίστα
    try {
      var a = JSON.parse(str || '[]');
      if (!Array.isArray(a)) return [];
      return a.slice(0, MAX_CUSTOM).map(function (x) {
        return { n: String((x && x.n) || '').slice(0, 80), t: String((x && x.t) || '').slice(0, 200) };
      });
    } catch (e) { return []; }
  }
  function clean(obj) {      // κρατάμε μόνο γνωστά πεδία με κείμενο, ώστε ένα ξένο αρχείο να μη χαλάσει τίποτα
    var out = {};
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(function (k) {
        if (!knownKeys[k] || typeof obj[k] !== 'string') return;
        if (k === 'custom') { var l = parseCustom(obj[k]); if (l.length) out[k] = JSON.stringify(l); }
        else out[k] = obj[k] === 'Άλλο (βλ. σημειώσεις)' ? OTHER : obj[k].slice(0, 2000);
      });
    }
    return out;
  }
  function isEmpty(s) { return !Object.keys(s).some(function (k) { return s[k]; }); }
  function isOther(v) { return String(v || '').indexOf('Άλλο') === 0; }
  function fieldValue(f) {               // η τιμή ενός πεδίου όπως φαίνεται στην κάρτα (το «Άλλο» δείχνει ό,τι έγραψε ο χρήστης)
    var v = state[f.id];
    if (isOther(v)) return String(state['o:' + f.id] || '').trim() || 'Άλλο';
    return v || '';
  }

  /* ---------- αποθήκευση ---------- */
  function save() {
    if (backup) backup.changed();
    if (shared) return;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ιδιωτική περιήγηση: δεν πειράζει */ }
  }
  function loadLocal() {
    try { return clean(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return {}; }
  }
  function toB64(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function fromB64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); }

  /* ---------- φόρμα ---------- */
  var inputs = {};   // id -> στοιχείο φόρμας
  var convItems = {};
  function bind(input, key) {
    inputs[key] = input;
    input.addEventListener('input', function () {
      state[key] = input.type === 'checkbox' ? (input.checked ? '1' : '') : input.value;
      if (input.type === 'checkbox' && convItems[key]) convItems[key].classList.toggle('on', input.checked);
      save();
      renderSheet();
    });
  }
  var otherSync = {};   // id -> συνάρτηση που δείχνει/κρύβει το πεδίο «Άλλο»
  function field(f) {
    var id = 'cc-' + f.id, input;
    if (f.type === 'select') {
      input = el('select', { id: id }, [el('option', { value: '', text: '—' })].concat(f.opts.map(function (o) { return el('option', { value: o, text: o }); })));
    } else {
      input = el('input', { id: id, type: 'text', maxlength: '200' });
      if (f.ph) input.placeholder = f.ph;
    }
    bind(input, f.id);
    var kids = [el('label', { for: id, text: f.label }), input];
    if (f.type === 'select' && f.opts.some(isOther)) {
      var other = el('input', { id: id + '-other', type: 'text', class: 'cc-other', maxlength: '200', placeholder: 'Γράψτε εδώ τι παίζετε', 'aria-label': f.label + ': άλλο' });
      bind(other, 'o:' + f.id);
      otherSync[f.id] = function () { other.hidden = !isOther(input.value); };
      input.addEventListener('input', otherSync[f.id]);
      otherSync[f.id]();
      kids.push(other);
    }
    return el('div', { class: 'cc-field' + (f.wide ? ' wide' : '') }, kids);
  }
  var customBox;
  function renderCustom() {
    customBox.textContent = '';
    var list = parseCustom(state.custom);
    list.forEach(function (c, i) {
      var name = el('input', { type: 'text', maxlength: '80', placeholder: 'Όνομα σύμβασης, π.χ. Kokish', 'aria-label': 'Όνομα σύμβασης' });
      var note = el('input', { type: 'text', maxlength: '200', placeholder: 'σημείωση (προαιρετικό)', 'aria-label': 'Σημείωση για τη σύμβαση' });
      var del = el('button', { type: 'button', class: 'cc-del', 'aria-label': 'Διαγραφή σύμβασης', title: 'Διαγραφή', text: '✕' });
      name.value = c.n; note.value = c.t;
      function upd() {
        var l = parseCustom(state.custom); if (!l[i]) return;
        l[i] = { n: name.value, t: note.value };
        state.custom = JSON.stringify(l); save(); renderSheet();
      }
      name.addEventListener('input', upd); note.addEventListener('input', upd);
      del.addEventListener('click', function () {
        var l = parseCustom(state.custom); l.splice(i, 1);
        state.custom = l.length ? JSON.stringify(l) : ''; save(); renderCustom(); renderSheet();
      });
      customBox.appendChild(el('div', { class: 'cc-custom-row' }, [name, note, del]));
    });
    addBtn.disabled = list.length >= MAX_CUSTOM;
  }
  var addBtn;
  function buildForm() {
    var form = el('div', { class: 'cc-editor' });
    SECTIONS.forEach(function (s) {
      form.appendChild(el('section', { class: 'cc-sec' }, [
        el('h2', { text: s.title }),
        el('div', { class: 'cc-fields' + (s.cols === 2 ? ' two' : '') }, s.fields.map(field))
      ]));
    });
    var list = el('div', { class: 'cc-groups' });
    CONV_GROUPS.forEach(function (g) {
      var box = el('div', { class: 'cc-conv' });
      g[1].forEach(function (c) {
        var cb = el('input', { type: 'checkbox', id: 'cc-c-' + c[0] });
        var note = el('input', { type: 'text', 'aria-label': 'Σημείωση για: ' + c[1], placeholder: 'σημείωση (προαιρετικό)', maxlength: '200' });
        var item = el('div', { class: 'cc-conv-item' }, [el('label', { for: 'cc-c-' + c[0] }, [cb, el('span', { text: c[1] })]), note]);
        convItems['c:' + c[0]] = item;
        bind(cb, 'c:' + c[0]);
        bind(note, 'n:' + c[0]);
        box.appendChild(item);
      });
      list.appendChild(el('h3', { class: 'cc-sub-h cc-group-h', text: g[0] }));
      list.appendChild(box);
    });
    customBox = el('div', { class: 'cc-custom' });
    addBtn = el('button', { type: 'button', class: 'btn btn--outline cc-add', text: '＋ Προσθήκη δικής σας σύμβασης' });
    addBtn.addEventListener('click', function () {
      var l = parseCustom(state.custom);
      if (l.length >= MAX_CUSTOM) return;
      l.push({ n: '', t: '' });
      state.custom = JSON.stringify(l); save(); renderCustom(); renderSheet();
      var rows = customBox.querySelectorAll('.cc-custom-row');
      rows[rows.length - 1].querySelector('input').focus();
    });
    form.appendChild(el('section', { class: 'cc-sec' }, [
      el('h2', { text: 'Συμβάσεις' }), list,
      el('h3', { class: 'cc-sub-h', text: 'Δικές σας συμβάσεις' }), customBox, addBtn
    ]));
    var ta = el('textarea', { id: 'cc-notes', rows: '4', maxlength: '2000', placeholder: 'Ό,τι άλλο θέλουν να ξέρουν οι αντίπαλοι: ειδικά ανοίγματα, εξαιρέσεις, αγορές με άλλη σημασία…' });
    bind(ta, 'notes');
    form.appendChild(el('section', { class: 'cc-sec' }, [el('h2', { text: 'Σημειώσεις' }), ta]));
    return form;
  }

  /* ---------- εκτυπώσιμη κάρτα ---------- */
  var sheet;
  function renderSheet() {
    sheet.textContent = '';
    var pair = [state.p1, state.p2].filter(Boolean).join(' – ');
    sheet.appendChild(el('header', { class: 'cc-sheet-head' }, [
      el('h2', { text: 'Κάρτα συμβάσεων' }),
      rich(el('p', { class: 'cc-pair' }), pair || 'Ονόματα ζευγαριού'),
      rich(el('p', { class: 'cc-sub' }), [state.system, state.club].filter(Boolean).join(' · '))
    ]));
    var cols = el('div', { class: 'cc-sheet-cols' });
    SECTIONS.slice(1).forEach(function (s) {
      var rows = s.fields.filter(fieldValue);
      if (!rows.length) return;
      cols.appendChild(el('section', {}, [el('h3', { text: s.title }), el('dl', {}, rows.reduce(function (acc, f) {
        acc.push(rich(el('dt'), f.label), rich(el('dd'), fieldValue(f)));
        return acc;
      }, []))]));
    });
    var conv = CONVENTIONS.filter(function (c) { return state['c:' + c[0]]; }).map(function (c) { return [c[1], state['n:' + c[0]]]; });
    parseCustom(state.custom).forEach(function (c) { if (c.n.trim()) conv.push([c.n.trim(), c.t.trim()]); });
    if (conv.length) {
      cols.appendChild(el('section', {}, [el('h3', { text: 'Συμβάσεις' }), el('ul', {}, conv.map(function (c) {
        var li = el('li', {}, [rich(el('strong'), c[0])]);
        if (c[1]) { li.appendChild(document.createTextNode(' – ')); rich(li, c[1]); }
        return li;
      }))]));
    }
    if (state.notes) cols.appendChild(el('section', { class: 'cc-notes' }, [el('h3', { text: 'Σημειώσεις' }), rich(el('p'), state.notes)]));
    if (!cols.children.length) cols.appendChild(el('p', { class: 'cc-empty', text: 'Συμπληρώστε τη φόρμα και η κάρτα θα εμφανιστεί εδώ, έτοιμη για εκτύπωση.' }));
    sheet.appendChild(cols);
  }

  /* ---------- PDF (δημιουργείται στη συσκευή: ίδιο αποτέλεσμα σε υπολογιστή και κινητό) ---------- */
  function sheetData() {                // τα περιεχόμενα της κάρτας ως απλές λίστες (όπως στο renderSheet)
    var secs = [];
    SECTIONS.slice(1).forEach(function (s) {
      var rows = s.fields.filter(fieldValue);
      if (rows.length) secs.push({ title: s.title, kind: 'dl', rows: rows.map(function (f) { return [f.label, fieldValue(f)]; }) });
    });
    var conv = CONVENTIONS.filter(function (c) { return state['c:' + c[0]]; }).map(function (c) { return [c[1], state['n:' + c[0]]]; });
    parseCustom(state.custom).forEach(function (c) { if (c.n.trim()) conv.push([c.n.trim(), c.t.trim()]); });
    if (conv.length) secs.push({ title: 'Συμβάσεις', kind: 'ul', rows: conv });
    return {
      pair: [state.p1, state.p2].filter(Boolean).join(' – ') || 'Ονόματα ζευγαριού',
      sub: [state.system, state.club].filter(Boolean).join(' · '),
      secs: secs, notes: state.notes || ''
    };
  }

  function buildPdf(fonts) {
    var P = HBPDF.begin(fonts), doc = P.doc, setFont = P.setFont, lineH = P.lineH, wrap = P.wrap, draw = P.draw, heading = P.heading;
    var GREEN = P.C.GREEN, MUTED = P.C.MUTED, INK = P.C.INK;
    var PW = 210, PH = 297, M = 12, GAP = 9, CW = (PW - 2 * M - GAP) / 2, FULL = PW - 2 * M;
    var d = sheetData();

    /* επικεφαλίδα */
    var y = M + 6;
    setFont(true, 20); doc.setTextColor.apply(doc, GREEN);
    doc.text('Κάρτα συμβάσεων', PW / 2, y, { align: 'center' });
    y += 8;
    wrap([{ t: d.pair, b: true }], 14, FULL).forEach(function (l) { draw(l, M, y, 14, INK, true, FULL); y += lineH(14); });
    if (d.sub) wrap([{ t: d.sub, b: false }], 10, FULL).forEach(function (l) { draw(l, M, y, 10, MUTED, true, FULL); y += lineH(10); });
    y += 1;
    doc.setDrawColor.apply(doc, GREEN); doc.setLineWidth(0.5); doc.line(M, y, PW - M, y);
    doc.setLineWidth(0.2); doc.line(M, y + 1.1, PW - M, y + 1.1);
    var top = y + 6, bottom = PH - M;

    /* κάθε ενότητα γίνεται σειρά από «κομμάτια» που δεν σπάνε ανάμεσα σε στήλες */
    var blocks = [];
    d.secs.forEach(function (s) {
      blocks.push({ h: 8, head: true, paint: function (x, y0) { heading(s.title, x, y0, CW); } });
      s.rows.forEach(function (r, i) {
        var gap = i === s.rows.length - 1 ? 5 : 0;
        if (s.kind === 'dl') {
          var ll = wrap([{ t: r[0], b: true }], 8.5, CW), vl = wrap([{ t: r[1], b: false }], 10, CW);
          blocks.push({ h: 1.8 + ll.length * lineH(8.5) + vl.length * lineH(10) + gap, paint: function (x, y0) {
            var yy = y0 + 1.8;
            ll.forEach(function (l) { yy += lineH(8.5); draw(l, x, yy - 1.1, 8.5, MUTED); });
            vl.forEach(function (l) { yy += lineH(10); draw(l, x, yy - 1.2, 10, INK); });
          } });
        } else {
          var runs = [{ t: r[0], b: true }];
          if (r[1]) runs.push({ t: ' – ' + r[1], b: false });
          var tl = wrap(runs, 10, CW - 4);
          blocks.push({ h: 1.6 + tl.length * lineH(10) + gap, paint: function (x, y0) {
            doc.setFillColor.apply(doc, GREEN); doc.circle(x + 1, y0 + 0.8 + lineH(10) - 2.4, 0.45, 'F');
            var yy = y0 + 0.8;
            tl.forEach(function (l) { yy += lineH(10); draw(l, x + 4, yy - 1.2, 10, INK); });
          } });
        }
      });
    });

    /* γέμισμα στηλών· αν όλα χωρούν σε μία σελίδα, οι δύο στήλες ισορροπούν */
    var total = blocks.reduce(function (a, b) { return a + b.h; }, 0);
    var target = total <= 2 * (bottom - top) - 10 ? total / 2 + 10 : bottom - top;
    var col = 0, pageTop = top, ends = [top, top];
    blocks.forEach(function (b, i) {
      var nxt = blocks[i + 1], need = b.h + (b.head && nxt ? nxt.h : 0);   // ο τίτλος δεν μένει μόνος στο τέλος στήλης
      if (ends[col] > pageTop && ends[col] - pageTop + need > target + 0.01) {
        if (col === 0) col = 1;
        else { doc.addPage(); col = 0; pageTop = M; ends = [M, M]; target = bottom - M; }
      }
      b.paint(M + col * (CW + GAP), ends[col]);
      ends[col] += b.h;
    });

    if (d.notes) {                      // οι σημειώσεις σε όλο το πλάτος, κάτω από τις στήλες
      var ny = Math.max(ends[0], ends[1]) + 3;
      if (ny + 9 + lineH(10) > bottom) { doc.addPage(); ny = M; }
      heading('Σημειώσεις', M, ny, FULL);
      ny += 8.5;
      wrap([{ t: d.notes, b: false }], 10, FULL).forEach(function (l) {
        if (ny + lineH(10) > bottom) { doc.addPage(); ny = M; }
        ny += lineH(10); draw(l, M, ny - 1.2, 10, INK);
      });
    }
    return doc;
  }
  var pdfBusy = false;
  function downloadPdf(b) {
    if (pdfBusy) return;
    pdfBusy = true;
    var old = b.textContent;
    b.textContent = 'Δημιουργία PDF…'; b.disabled = true;
    HBPDF.load().then(function (fonts) {
      var doc = buildPdf(fonts);
      doc.setProperties({ title: 'Κάρτα συμβάσεων' });
      doc.save('karta-symvaseon.pdf');
      toast('Το PDF δημιουργήθηκε.');
    }).catch(function () {
      toast('Δεν μπόρεσε να δημιουργηθεί το PDF. Δοκιμάστε «Εκτύπωση».');
    }).then(function () { pdfBusy = false; b.textContent = old; b.disabled = false; });
  }

  /* ---------- ενέργειες ---------- */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('cc-toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3500);
  }
  function fill() {
    Object.keys(inputs).forEach(function (k) {
      var i = inputs[k], v = state[k] || '';
      if (i.type === 'checkbox') { i.checked = !!v; if (convItems[k]) convItems[k].classList.toggle('on', !!v); } else i.value = v;
    });
    Object.keys(otherSync).forEach(function (k) { otherSync[k](); });
    renderCustom();
    renderSheet();
  }
  function setBanner(on) {
    document.getElementById('cc-banner').hidden = !on;
  }
  function leaveShared() {
    shared = false; setBanner(false);
    history.replaceState(null, '', location.pathname);
  }
  function download() {
    if (isEmpty(state)) { toast('Η κάρτα είναι κενή, δεν υπάρχει τίποτα να αποθηκευτεί. Συμπληρώστε κάτι και δοκιμάστε ξανά.'); return; }
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: 'karta-symvaseon.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    if (backup) backup.exported();
  }
  function openFile(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = clean(JSON.parse(String(r.result).replace(/^\uFEFF/, '')));
        if (isEmpty(data)) { toast('Η κάρτα του αρχείου είναι κενή: δεν έχει κανένα στοιχείο.'); return; }
        if (!isEmpty(state) && !shared && !window.confirm('Η κάρτα του αρχείου θα αντικαταστήσει αυτήν που έχετε τώρα. Συνέχεια;')) return;
        state = data; leaveShared(); save(); fill();
        toast('Η κάρτα άνοιξε από το αρχείο.');
      } catch (e) { toast('Το αρχείο δεν είναι κάρτα συμβάσεων.'); }
    };
    r.readAsText(file);
  }
  function shareLink() {
    var link = location.origin + location.pathname + '#c=' + toB64(JSON.stringify(state));
    function done() { toast('Ο σύνδεσμος αντιγράφηκε. Όποιος τον ανοίξει βλέπει την κάρτα σας.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { window.prompt('Αντιγράψτε τον σύνδεσμο:', link); });
    else window.prompt('Αντιγράψτε τον σύνδεσμο:', link);
  }
  function defaults() {
    if (!isEmpty(state) && !window.confirm('Η συμπλήρωση με τυπικές τιμές θα αντικαταστήσει ό,τι έχετε γράψει. Συνέχεια;')) return;
    var s = {};
    Object.keys(DEFAULTS).forEach(function (k) { if (k !== 'conv') s[k] = DEFAULTS[k]; });
    Object.keys(DEFAULTS.conv).forEach(function (k) { s['c:' + k] = '1'; if (DEFAULTS.conv[k]) s['n:' + k] = DEFAULTS.conv[k]; });
    state = clean(s);
    if (shared) leaveShared();
    save(); fill();
    toast('Η κάρτα συμπληρώθηκε με τυπικές τιμές. Αλλάξτε ό,τι δεν ισχύει για εσάς.');
  }
  function clearAll() {
    if (!window.confirm('Να διαγραφεί η κάρτα από αυτή τη συσκευή;')) return;
    state = {}; leaveShared();
    try { localStorage.removeItem(KEY); } catch (e) { /* τίποτα */ }
    fill();
  }
  function btn(label, fn, cls) { var b = el('button', { type: 'button', class: 'btn ' + (cls || 'btn--outline'), text: label }); b.addEventListener('click', fn); return b; }

  /* ---------- εκκίνηση ---------- */
  function init() {
    var m = /^#c=([\w-]+)$/.exec(location.hash);
    var fromLink = null;
    if (m) { try { fromLink = clean(JSON.parse(fromB64(m[1]))); } catch (e) { fromLink = null; } }
    if (fromLink && !isEmpty(fromLink)) { state = fromLink; shared = true; } else { state = loadLocal(); }

    backup = HBBackup.create({
      key: 'hbc-convention-card-v1-exp',
      get: function () { return JSON.stringify(state); }, empty: function () { return isEmpty(state); },
      download: download, skip: function () { return shared; }
    });
    var fileIn = el('input', { type: 'file', accept: '.json,application/json', hidden: '' });
    fileIn.addEventListener('change', function () { if (fileIn.files[0]) openFile(fileIn.files[0]); fileIn.value = ''; });

    var banner = el('div', { id: 'cc-banner', class: 'callout warn', hidden: '' }, [
      el('p', { text: 'Βλέπετε κάρτα που σας έστειλαν με σύνδεσμο. Οι αλλαγές σας δεν αποθηκεύονται, εκτός αν την κρατήσετε ως δική σας.' }),
      btn('Κράτησέ την ως δική μου', function () {
        if (!isEmpty(loadLocal()) && !window.confirm('Θα αντικαταστήσει την κάρτα που έχετε αποθηκευμένη εδώ. Συνέχεια;')) return;
        leaveShared(); save(); toast('Η κάρτα αποθηκεύτηκε σε αυτή τη συσκευή.');
      }, 'btn')
    ]);

    var pdfBtn = btn('Λήψη PDF', function () { downloadPdf(pdfBtn); }, 'btn');
    var actions = el('div', { class: 'cc-actions' }, [
      pdfBtn,
      btn('Εκτύπωση', function () { window.print(); }),
      btn('Συμπλήρωση με τυπικές τιμές', defaults),
      btn('Λήψη αρχείου', download),
      btn('Άνοιγμα αρχείου', function () { fileIn.click(); }),
      btn('Σύνδεσμος κοινοποίησης', shareLink),
      btn('Καθαρισμός', clearAll),
      fileIn
    ]);

    sheet = el('article', { class: 'cc-sheet', 'aria-label': 'Εκτυπώσιμη κάρτα συμβάσεων' });
    root.appendChild(el('p', { class: 'meta cc-hint', text: 'Τα στοιχεία αποθηκεύονται αυτόματα σε αυτή τη συσκευή και δεν στέλνονται πουθενά. Για να τα έχετε αλλού, κατεβάστε το αρχείο ή στείλτε τον σύνδεσμο.' }));
    root.appendChild(HBSuits.help());
    root.appendChild(banner);
    root.appendChild(backup.el);
    root.appendChild(actions);
    root.appendChild(buildForm());
    root.appendChild(el('h2', { class: 'cc-preview-title', text: 'Προεπισκόπηση κάρτας' }));
    root.appendChild(sheet);
    root.appendChild(el('div', { id: 'cc-toast', class: 'cc-toast', role: 'status', hidden: '' }));
    HBSuits.init(root);
    fill();
    setBanner(shared);
    backup.start();
  }
  if (root) init();
})();
