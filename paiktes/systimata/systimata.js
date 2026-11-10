/* ==========================================================================
   Συστήματα – καταγραφή του συστήματος αγοράς ως δέντρο δηλώσεων.
   --------------------------------------------------------------------------
   Δεν υπάρχει διακομιστής: το σύστημα αποθηκεύεται αυτόματα στον περιηγητή (localStorage),
   και μπορεί να αποθηκευτεί ως αρχείο (.json), να ανοιχτεί από αρχείο ή να σταλεί με σύνδεσμο
   (τα δεδομένα μπαίνουν στο κομμάτι της διεύθυνσης μετά το #, που δεν στέλνεται πουθενά).

   Μοντέλο: { name, nodes: [ { b: δήλωση, m: σημασία, k: 1 αν είναι μαζεμένος ο κλάδος, c: [παιδιά] } ] }
   Κάθε κόμβος είναι μια δήλωση· η διαδρομή από την κορυφή ως αυτόν είναι η ακολουθία της αγοράς.
   Οι αντίπαλοι θεωρούνται πάσο, εκτός αν γράψετε τη δήλωσή τους σε παρένθεση, π.χ. (1♠).
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'hbc-system-v1';
  var MAX_NODES = 500, MAX_DEPTH = 24;
  var SUITS = { s: '♠', h: '♥', d: '♦', c: '♣' };
  var root = document.getElementById('sy');
  if (!root) return;

  var data = { name: '', nodes: [] };
  var shared = false;      // true όταν βλέπουμε σύστημα από σύνδεσμο (δεν αποθηκεύεται αυτόματα)
  var view = 'tree';       // 'tree' | 'table'
  var editing = null, editingArr = null;   // ο κόμβος που επεξεργαζόμαστε και η λίστα που τον περιέχει
  var lastField = null;    // το τελευταίο πεδίο κειμένου με εστίαση (για τα σύμβολα)
  var ui = {};

  /* Παράδειγμα για το κουμπί «Παράδειγμα»: [δήλωση, σημασία, [παιδιά]] */
  var SAMPLE = [
    ['1♣', '3+ σπαθιά, 12–21 πόντοι'],
    ['1♦', '4+ καρά, 12–21 πόντοι, χωρίς 5φ μαζέρ'],
    ['1♥', '5+ κούπες, 12–21 πόντοι'],
    ['1♠', '5+ πίκες, 12–21 πόντοι'],
    ['1NT', '15–17 πόντοι, ισορροπημένο χέρι', [
      ['2♣', 'Stayman: ρωτάει για 4φ μαζέρ', [['2♦', 'Χωρίς 4φ μαζέρ'], ['2♥', '4+ κούπες'], ['2♠', '4+ πίκες']]],
      ['2♦', 'Jacoby Transfer: 5+ κούπες (ο ανοίξας λέει 2♥)'],
      ['2♥', 'Jacoby Transfer: 5+ πίκες (ο ανοίξας λέει 2♠)'],
      ['3NT', 'Μανς, χωρίς μαζέρ']
    ]],
    ['2♣', 'Ισχυρό, αναγκαστικό (22+ πόντοι)']
  ];

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
  function str(v, n) { return typeof v === 'string' ? v.slice(0, n) : ''; }
  function mk(b, m, kids) { return { b: b || '', m: m || '', k: 0, c: kids || [] }; }
  function total(nodes) { return nodes.reduce(function (a, n) { return a + 1 + total(n.c); }, 0); }
  function fromSample(list) { return list.map(function (x) { return mk(x[0], x[1], x[2] ? fromSample(x[2]) : []); }); }
  function cleanNode(n, depth, budget) {   // κρατάμε μόνο γνωστά πεδία με κείμενο, ώστε ένα ξένο αρχείο να μη χαλάσει τίποτα
    if (!n || typeof n !== 'object' || budget.left <= 0) return null;
    budget.left--;
    var out = mk(str(n.b, 24), str(n.m, 300));
    out.k = n.k ? 1 : 0;
    if (depth < MAX_DEPTH && Array.isArray(n.c)) {
      n.c.forEach(function (ch) { var x = cleanNode(ch, depth + 1, budget); if (x) out.c.push(x); });
    }
    return out;
  }
  function clean(obj) {
    var budget = { left: MAX_NODES }, out = { name: str(obj && obj.name, 80), nodes: [] };
    if (obj && Array.isArray(obj.nodes)) {
      obj.nodes.forEach(function (n) { var x = cleanNode(n, 1, budget); if (x) out.nodes.push(x); });
    }
    return out;
  }
  function isEmpty(d) { return !d.name && !d.nodes.length; }
  function toB64(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function fromB64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; return decodeURIComponent(escape(atob(s))); }

  /* ---------- αποθήκευση ---------- */
  function save() {
    if (shared) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ιδιωτική περιήγηση: δεν πειράζει */ }
  }
  function loadLocal() {
    try { return clean(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return clean({}); }
  }

  /* ---------- σύμβολα τράπουλας ---------- */
  function insertAt(input, text) {
    var s = input.selectionStart == null ? input.value.length : input.selectionStart;
    var e = input.selectionEnd == null ? s : input.selectionEnd;
    input.value = input.value.slice(0, s) + text + input.value.slice(e);
    input.setSelectionRange(s + text.length, s + text.length);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function shortcuts(input) {            // !s !h !d !c → ♠ ♥ ♦ ♣, με σωστή θέση του δρομέα
    var re = /!([shdc])/gi;
    if (!re.test(input.value)) return;
    var pos = input.selectionStart == null ? input.value.length : input.selectionStart;
    var conv = function (t) { return t.replace(/!([shdc])/gi, function (m, l) { return SUITS[l.toLowerCase()]; }); };
    var before = conv(input.value.slice(0, pos));
    input.value = before + conv(input.value.slice(pos));
    input.setSelectionRange(before.length, before.length);
  }
  function symbolBar() {
    var bar = el('div', { class: 'cc-symbols', role: 'group', 'aria-label': 'Σύμβολα τράπουλας' }, [el('span', { class: 'cc-sym-label', text: 'Σύμβολα' })]);
    [['s', 'Πίκα'], ['h', 'Κούπα'], ['d', 'Καρό'], ['c', 'Σπαθί']].forEach(function (x) {
      var b = el('button', { type: 'button', class: 'cc-sym' + (x[0] === 'h' || x[0] === 'd' ? ' rs' : ''), 'aria-label': 'Εισαγωγή: ' + x[1], title: x[1] + ' (!' + x[0] + ')', text: SUITS[x[0]] });
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });   // το πεδίο κρατά την εστίαση
      b.addEventListener('click', function () {
        if (!lastField || !document.body.contains(lastField)) { toast('Πατήστε πρώτα μέσα σε ένα πεδίο κειμένου.'); return; }
        lastField.focus();
        insertAt(lastField, SUITS[x[0]]);
      });
      bar.appendChild(b);
    });
    bar.appendChild(el('span', { class: 'cc-sym-hint', text: 'ή γράψτε !s !h !d !c' }));
    return bar;
  }

  /* ---------- δέντρο (επεξεργασία) ---------- */
  function updateCount() {
    var n = total(data.nodes);
    ui.count.textContent = n + ' / ' + MAX_NODES + ' δηλώσεις';
  }
  function iconBtn(label, text, fn, cls) {
    var b = el('button', { type: 'button', class: 'sy-ib' + (cls ? ' ' + cls : ''), 'aria-label': label, title: label, text: text });
    b.addEventListener('click', fn);
    return b;
  }
  function finishEdit() {
    if (editing && !editing.b.trim() && !editing.m.trim() && !editing.c.length && editingArr) {
      var i = editingArr.indexOf(editing);
      if (i >= 0) editingArr.splice(i, 1);      // κενός κόμβος που δεν συμπληρώθηκε: φεύγει
    }
    editing = null; editingArr = null;
    save(); renderTree();
  }
  function startEdit(n, arr) {
    if (editing && editing !== n) finishEdit();
    editing = n; editingArr = arr;
    renderTree();
    var i = ui.tree.querySelector('.sy-bid-in');
    if (i) i.focus();
  }
  function addChild(arr, parent) {
    if (total(data.nodes) >= MAX_NODES) { toast('Έχετε φτάσει το όριο των ' + MAX_NODES + ' δηλώσεων.'); return; }
    if (editing) finishEdit();
    var n = mk();
    arr.push(n);
    if (parent) parent.k = 0;
    editing = n; editingArr = arr;
    save(); renderTree();
    var i = ui.tree.querySelector('.sy-bid-in');
    if (i) { i.focus(); i.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function removeAt(arr, i) {
    var n = arr[i], cnt = total([n]);
    if (cnt > 1 && !window.confirm('Θα διαγραφεί η δήλωση και όλες οι απαντήσεις από κάτω της (' + cnt + ' δηλώσεις συνολικά). Συνέχεια;')) return;
    arr.splice(i, 1);
    if (editing === n) { editing = null; editingArr = null; }
    save(); renderTree();
  }
  function moveAt(arr, i, d) {
    var j = i + d;
    if (j < 0 || j >= arr.length) return;
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    save(); renderTree();
  }
  function setAll(nodes, collapsed) { nodes.forEach(function (n) { n.k = collapsed && n.c.length ? 1 : 0; setAll(n.c, collapsed); }); }

  function nodeEl(n, arr, i) {
    var box = el('div', { class: 'sy-node' });
    var row = el('div', { class: 'sy-row' + (editing === n ? ' editing' : '') });
    var has = n.c.length > 0;
    var tog = el('button', { type: 'button', class: 'sy-tog', 'aria-label': n.k ? 'Ανάπτυξη' : 'Σύμπτυξη', 'aria-expanded': String(!n.k), text: has ? (n.k ? '▸' : '▾') : '' });
    if (has) tog.addEventListener('click', function () { n.k = n.k ? 0 : 1; save(); renderTree(); }); else tog.disabled = true;
    row.appendChild(tog);

    if (editing === n) {
      var bi = el('input', { type: 'text', class: 'sy-bid-in', maxlength: '24', placeholder: 'Δήλωση, π.χ. 1♣', 'aria-label': 'Δήλωση' });
      var mi = el('input', { type: 'text', class: 'sy-m-in', maxlength: '300', placeholder: 'Τι σημαίνει (προαιρετικά)', 'aria-label': 'Σημασία' });
      bi.value = n.b; mi.value = n.m;
      [bi, mi].forEach(function (inp) {
        inp.addEventListener('focus', function () { lastField = inp; });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { e.preventDefault(); finishEdit(); }
          else if (e.key === 'Enter') { e.preventDefault(); if (inp === bi) mi.focus(); else finishEdit(); }
        });
      });
      bi.addEventListener('input', function () { shortcuts(bi); n.b = bi.value; save(); updateCount(); });
      mi.addEventListener('input', function () { shortcuts(mi); n.m = mi.value; save(); });
      row.appendChild(bi); row.appendChild(mi);
      row.appendChild(iconBtn('Τέλος επεξεργασίας', '✓', finishEdit, 'ok'));
    } else {
      var chip = rich(el('button', { type: 'button', class: 'sy-chip' + (n.b ? '' : ' empty'), 'aria-label': 'Επεξεργασία δήλωσης' }), n.b || '—');
      chip.addEventListener('click', function () { startEdit(n, arr); });
      var meaning = rich(el('span', { class: 'sy-meaning' + (n.m ? '' : ' empty') }), n.m || 'χωρίς σημασία');
      meaning.addEventListener('click', function () { startEdit(n, arr); });
      row.appendChild(chip); row.appendChild(meaning);
      var acts = el('span', { class: 'sy-acts' });
      acts.appendChild(iconBtn('Προσθήκη απάντησης από κάτω', '＋', function () { addChild(n.c, n); }));
      acts.appendChild(iconBtn('Επεξεργασία', '✎', function () { startEdit(n, arr); }));
      acts.appendChild(iconBtn('Μετακίνηση πάνω', '↑', function () { moveAt(arr, i, -1); }, i === 0 ? 'dis' : ''));
      acts.appendChild(iconBtn('Μετακίνηση κάτω', '↓', function () { moveAt(arr, i, 1); }, i === arr.length - 1 ? 'dis' : ''));
      acts.appendChild(iconBtn('Διαγραφή', '✕', function () { removeAt(arr, i); }, 'del'));
      row.appendChild(acts);
    }
    box.appendChild(row);
    if (has && !n.k) {
      var kids = el('div', { class: 'sy-kids' });
      n.c.forEach(function (ch, j) { kids.appendChild(nodeEl(ch, n.c, j)); });
      var add = el('button', { type: 'button', class: 'sy-add', text: '＋ Προσθήκη απάντησης' });
      add.addEventListener('click', function () { addChild(n.c, n); });
      kids.appendChild(add);
      box.appendChild(kids);
    }
    return box;
  }
  function renderTree() {
    ui.tree.textContent = '';
    if (!data.nodes.length) ui.tree.appendChild(el('p', { class: 'meta sy-empty', text: 'Το σύστημα είναι άδειο. Ξεκινήστε με την πρώτη δήλωση (π.χ. ένα άνοιγμα), ή δείτε το «Παράδειγμα».' }));
    data.nodes.forEach(function (n, i) { ui.tree.appendChild(nodeEl(n, data.nodes, i)); });
    var add = el('button', { type: 'button', class: 'sy-add root', text: '＋ Προσθήκη άνοιγματος' });
    add.addEventListener('click', function () { addChild(data.nodes, null); });
    ui.tree.appendChild(add);
    updateCount();
  }

  /* ---------- πίνακας (προβολή και εκτύπωση) ---------- */
  function flatten(nodes, path, out) {
    nodes.forEach(function (n) {
      var p = path.concat(n.b.trim() || '…');
      out.push({ seq: p.join(' – '), m: n.m.trim(), depth: path.length });
      flatten(n.c, p, out);
    });
    return out;
  }
  function renderSheet() {
    var rows = flatten(data.nodes, [], []);
    ui.sheet.textContent = '';
    ui.sheet.appendChild(el('header', { class: 'sy-sheet-head' }, [el('h2', { text: data.name.trim() || 'Σύστημα αγοράς' })]));
    if (!rows.length) { ui.sheet.appendChild(el('p', { class: 'cc-empty', text: 'Το σύστημα είναι άδειο.' })); return; }
    var body = el('tbody');
    rows.forEach(function (r) {
      body.appendChild(el('tr', { class: r.depth === 0 ? 'top' : '' }, [
        rich(el('th', { scope: 'row' }), r.seq),
        rich(el('td'), r.m)
      ]));
    });
    ui.sheet.appendChild(el('table', { class: 'sy-table' }, [
      el('thead', {}, [el('tr', {}, [el('th', { text: 'Ακολουθία' }), el('th', { text: 'Σημασία' })])]),
      body
    ]));
  }
  function setView(v) {
    if (editing) finishEdit();
    view = v;
    ui.tabTree.classList.toggle('on', v === 'tree'); ui.tabTree.setAttribute('aria-pressed', String(v === 'tree'));
    ui.tabTable.classList.toggle('on', v === 'table'); ui.tabTable.setAttribute('aria-pressed', String(v === 'table'));
    ui.treeWrap.hidden = v !== 'tree';
    ui.sheet.classList.toggle('show', v === 'table');
    if (v === 'table') renderSheet();
  }

  /* ---------- PDF ---------- */
  var pdfBusy = false;
  function buildPdf(fonts) {
    var P = HBPDF.begin(fonts), doc = P.doc, GREEN = P.C.GREEN, INK = P.C.INK, MUTED = P.C.MUTED;
    var PW = 210, PH = 297, M = 14, SEQ = 60, GAP = 5, MW = PW - 2 * M - SEQ - GAP, FS = 10;
    var rows = flatten(data.nodes, [], []);
    var y = M + 6;
    P.setFont(true, 20); doc.setTextColor.apply(doc, GREEN);
    P.wrap([{ t: data.name.trim() || 'Σύστημα αγοράς', b: true }], 20, PW - 2 * M).forEach(function (l) { P.draw(l, M, y, 20, GREEN, true, PW - 2 * M); y += P.lineH(20); });
    y += 0.5;
    doc.setDrawColor.apply(doc, GREEN); doc.setLineWidth(0.5); doc.line(M, y, PW - M, y);
    doc.setLineWidth(0.2); doc.line(M, y + 1.1, PW - M, y + 1.1);
    y += 6;
    function colHeads() {
      P.setFont(true, 8.5); doc.setTextColor.apply(doc, MUTED);
      doc.text('ΑΚΟΛΟΥΘΙΑ', M, y + 3); doc.text('ΣΗΜΑΣΙΑ', M + SEQ + GAP, y + 3);
      y += 6;
    }
    colHeads();
    if (!rows.length) { P.draw([{ t: 'Το σύστημα είναι άδειο.', b: false }], M, y + 4, FS, MUTED); return doc; }
    rows.forEach(function (r, idx) {
      var sl = P.wrap([{ t: r.seq, b: true }], FS, SEQ), ml = P.wrap([{ t: r.m, b: false }], FS, MW);
      var lines = Math.max(sl.length, ml.length, 1), lh = P.lineH(FS), h = lines * lh + 2.6;
      if (y + h > PH - M) { doc.addPage(); y = M; colHeads(); }
      if (r.depth === 0 && idx > 0) { doc.setDrawColor.apply(doc, GREEN); doc.setLineWidth(0.35); doc.line(M, y, PW - M, y); }
      else { doc.setDrawColor(215, 224, 219); doc.setLineWidth(0.15); doc.line(M, y, PW - M, y); }
      sl.forEach(function (l, i) { P.draw(l, M, y + 1.3 + (i + 1) * lh - 1.1, FS, INK); });
      ml.forEach(function (l, i) { P.draw(l, M + SEQ + GAP, y + 1.3 + (i + 1) * lh - 1.1, FS, INK); });
      y += h;
    });
    doc.setDrawColor(215, 224, 219); doc.setLineWidth(0.15); doc.line(M, y, PW - M, y);
    return doc;
  }
  function downloadPdf(b) {
    if (pdfBusy) return;
    if (!data.nodes.length) { toast('Το σύστημα είναι άδειο: προσθέστε πρώτα μερικές δηλώσεις.'); return; }
    if (editing) finishEdit();
    pdfBusy = true;
    var old = b.textContent;
    b.textContent = 'Δημιουργία PDF…'; b.disabled = true;
    HBPDF.load().then(function (fonts) {
      var doc = buildPdf(fonts);
      doc.setProperties({ title: data.name.trim() || 'Σύστημα αγοράς' });
      doc.save('systima.pdf');
      toast('Το PDF δημιουργήθηκε.');
    }).catch(function () {
      toast('Δεν μπόρεσε να δημιουργηθεί το PDF. Δοκιμάστε «Εκτύπωση».');
    }).then(function () { pdfBusy = false; b.textContent = old; b.disabled = false; });
  }

  /* ---------- ενέργειες ---------- */
  var toastTimer;
  function toast(msg) {
    ui.toast.textContent = msg;
    ui.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast.hidden = true; }, 3500);
  }
  function refresh() {
    ui.name.value = data.name;
    renderTree();
    if (view === 'table') renderSheet();
  }
  function leaveShared() {
    shared = false; ui.banner.hidden = true;
    history.replaceState(null, '', location.pathname);
  }
  function download() {
    if (isEmpty(data)) { toast('Το σύστημα είναι άδειο, δεν υπάρχει τίποτα να αποθηκευτεί.'); return; }
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = el('a', { href: URL.createObjectURL(blob), download: 'systima.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function openFile(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = clean(JSON.parse(String(r.result).replace(/^﻿/, '')));
        if (isEmpty(d)) { toast('Το σύστημα του αρχείου είναι κενό: δεν έχει καμία δήλωση.'); return; }
        if (!isEmpty(data) && !shared && !window.confirm('Το σύστημα του αρχείου θα αντικαταστήσει αυτό που έχετε τώρα. Συνέχεια;')) return;
        data = d; editing = null; leaveShared(); save(); refresh();
        toast('Το σύστημα άνοιξε από το αρχείο.');
      } catch (e) { toast('Το αρχείο δεν είναι σύστημα αγοράς.'); }
    };
    r.readAsText(file);
  }
  function shareLink() {
    var link = location.origin + location.pathname + '#s=' + toB64(JSON.stringify(data));
    if (link.length > 8000) { toast('Το σύστημα είναι πολύ μεγάλο για σύνδεσμο. Χρησιμοποιήστε «Λήψη αρχείου».'); return; }
    function done() { toast('Ο σύνδεσμος αντιγράφηκε. Όποιος τον ανοίξει βλέπει το σύστημά σας.'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, function () { window.prompt('Αντιγράψτε τον σύνδεσμο:', link); });
    else window.prompt('Αντιγράψτε τον σύνδεσμο:', link);
  }
  function sample() {
    if (!isEmpty(data) && !window.confirm('Το παράδειγμα θα αντικαταστήσει ό,τι έχετε γράψει. Συνέχεια;')) return;
    data = { name: 'Παράδειγμα συστήματος', nodes: fromSample(SAMPLE) };
    editing = null;
    if (shared) leaveShared();
    save(); refresh();
    toast('Φορτώθηκε ένα παράδειγμα. Αλλάξτε ό,τι δεν ισχύει για εσάς.');
  }
  function clearAll() {
    if (!window.confirm('Να διαγραφεί το σύστημα από αυτή τη συσκευή;')) return;
    data = { name: '', nodes: [] }; editing = null; leaveShared();
    try { localStorage.removeItem(KEY); } catch (e) { /* τίποτα */ }
    refresh();
  }
  function btn(label, fn, cls) { var b = el('button', { type: 'button', class: 'btn ' + (cls || 'btn--outline'), text: label }); b.addEventListener('click', fn); return b; }

  /* ---------- εκκίνηση ---------- */
  function init() {
    var m = /^#s=([\w-]+)$/.exec(location.hash), fromLink = null;
    if (m) { try { fromLink = clean(JSON.parse(fromB64(m[1]))); } catch (e) { fromLink = null; } }
    if (fromLink && !isEmpty(fromLink)) { data = fromLink; shared = true; } else { data = loadLocal(); }

    var fileIn = el('input', { type: 'file', accept: '.json,application/json', hidden: '' });
    fileIn.addEventListener('change', function () { if (fileIn.files[0]) openFile(fileIn.files[0]); fileIn.value = ''; });

    ui.banner = el('div', { id: 'cc-banner', class: 'callout warn', hidden: '' }, [
      el('p', { text: 'Βλέπετε σύστημα που σας έστειλαν με σύνδεσμο. Οι αλλαγές σας δεν αποθηκεύονται, εκτός αν το κρατήσετε ως δικό σας.' }),
      btn('Κράτησέ το ως δικό μου', function () {
        if (!isEmpty(loadLocal()) && !window.confirm('Θα αντικαταστήσει το σύστημα που έχετε αποθηκευμένο εδώ. Συνέχεια;')) return;
        leaveShared(); save(); toast('Το σύστημα αποθηκεύτηκε σε αυτή τη συσκευή.');
      }, 'btn')
    ]);

    var pdfBtn = btn('Λήψη PDF', function () { downloadPdf(pdfBtn); }, 'btn');
    var actions = el('div', { class: 'cc-actions' }, [
      pdfBtn,
      btn('Εκτύπωση', function () { if (editing) finishEdit(); renderSheet(); window.print(); }),
      btn('Παράδειγμα', sample),
      btn('Λήψη αρχείου', download),
      btn('Άνοιγμα αρχείου', function () { fileIn.click(); }),
      btn('Σύνδεσμος κοινοποίησης', shareLink),
      btn('Καθαρισμός', clearAll),
      fileIn
    ]);

    ui.name = el('input', { type: 'text', id: 'sy-name', maxlength: '80', placeholder: 'π.χ. Standard 5φ μαζέρ – Μάνος και Γιάννης' });
    ui.name.addEventListener('input', function () { data.name = ui.name.value; save(); if (view === 'table') renderSheet(); });
    ui.name.addEventListener('focus', function () { lastField = ui.name; });

    ui.tabTree = el('button', { type: 'button', class: 'sy-tab on', 'aria-pressed': 'true', text: 'Δέντρο' });
    ui.tabTable = el('button', { type: 'button', class: 'sy-tab', 'aria-pressed': 'false', text: 'Πίνακας' });
    ui.tabTree.addEventListener('click', function () { setView('tree'); });
    ui.tabTable.addEventListener('click', function () { setView('table'); });
    ui.count = el('span', { class: 'meta sy-count' });
    ui.tree = el('div', { class: 'sy-tree' });
    ui.sheet = el('article', { class: 'sy-sheet', 'aria-label': 'Το σύστημα ως πίνακας' });
    ui.toast = el('div', { id: 'cc-toast', class: 'cc-toast', role: 'status', hidden: '' });

    var nameBox = el('div', { class: 'cc-field sy-name' }, [el('label', { for: 'sy-name', text: 'Όνομα συστήματος' }), ui.name]);
    var tabsBar = el('div', { class: 'sy-bar sy-bar-top' }, [
      el('div', { class: 'sy-tabs', role: 'group', 'aria-label': 'Προβολή' }, [ui.tabTree, ui.tabTable]), ui.count
    ]);
    ui.treeWrap = el('div', { class: 'sy-tree-wrap' }, [
      el('div', { class: 'sy-bar-r2' }, [
        btn('Σύμπτυξη όλων', function () { setAll(data.nodes, true); save(); renderTree(); }, 'btn btn--outline sy-small'),
        btn('Ανάπτυξη όλων', function () { setAll(data.nodes, false); save(); renderTree(); }, 'btn btn--outline sy-small')
      ]),
      ui.tree
    ]);

    var uiBox = el('div', { class: 'sy-ui' }, [
      el('p', { class: 'meta cc-hint', text: 'Τα στοιχεία αποθηκεύονται αυτόματα σε αυτή τη συσκευή και δεν στέλνονται πουθενά. Κάθε δήλωση έχει από κάτω της τις απαντήσεις. Οι αντίπαλοι θεωρούνται πάσο, εκτός αν γράψετε τη δήλωσή τους σε παρένθεση, π.χ. (1♠). Για να τα έχετε και αλλού, χρησιμοποιήστε «Λήψη αρχείου» ή «Σύνδεσμος κοινοποίησης».' }),
      ui.banner, actions, symbolBar(), nameBox, tabsBar, ui.treeWrap
    ]);
    root.appendChild(uiBox);
    root.appendChild(ui.sheet);
    root.appendChild(ui.toast);

    document.addEventListener('focusin', function (e) {
      var t = e.target;
      if (t.tagName === 'INPUT' && t.type === 'text' && root.contains(t)) lastField = t;
    });
    window.addEventListener('beforeprint', function () { if (editing) finishEdit(); renderSheet(); });

    ui.name.value = data.name;
    renderTree();
    renderSheet();
    ui.banner.hidden = !shared;
  }
  init();
})();
