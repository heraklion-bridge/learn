/* ==========================================================================
   Κοινά εργαλεία για PDF (χρησιμοποιούνται από την Κάρτα συμβάσεων και τα Συστήματα).
   Το PDF δημιουργείται στη συσκευή του χρήστη με τη βιβλιοθήκη jsPDF και τη γραμματοσειρά DejaVu Sans
   (υποσύνολο: ελληνικά, λατινικά, σύμβολα τράπουλας). Φορτώνονται μόνο όταν ζητηθεί PDF.
     HBPDF.load()       → Promise με τις γραμματοσειρές
     HBPDF.begin(fonts) → { doc, C, setFont, lineH, wrap, draw, heading }
   ========================================================================== */
window.HBPDF = (function () {
  'use strict';
  var cs = document.currentScript;
  var BASE = (cs && cs.src ? cs.src.replace(/[^\/]*$/, '') : '') + 'vendor/pdf/';
  var libs;

  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var t = document.createElement('script');
      t.src = src; t.onload = ok; t.onerror = function () { fail(new Error('script')); };
      document.head.appendChild(t);
    });
  }
  function fetchFont(name) {            // γραμματοσειρά → δυαδικό κείμενο, όπως το θέλει η jsPDF
    return fetch(BASE + name).then(function (r) {
      if (!r.ok) throw new Error('font');
      return r.arrayBuffer();
    }).then(function (buf) {
      var bytes = new Uint8Array(buf), bin = '';
      for (var i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
      return bin;
    });
  }
  function load() {
    if (!libs) {
      libs = Promise.all([
        window.jspdf ? 0 : loadScript(BASE + 'jspdf.umd.min.js'),
        fetchFont('DejaVuSans.ttf'), fetchFont('DejaVuSans-Bold.ttf')
      ]).then(function (r) { return { regular: r[1], bold: r[2] }; });
      libs.catch(function () { libs = null; });
    }
    return libs;
  }

  function begin(fonts) {
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    doc.addFileToVFS('DejaVuSans.ttf', fonts.regular);
    doc.addFileToVFS('DejaVuSans-Bold.ttf', fonts.bold);
    doc.addFont('DejaVuSans.ttf', 'DejaVu', 'normal');
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVu', 'bold');
    var C = { GREEN: [35, 92, 64], MUTED: [107, 122, 114], RED: [198, 40, 40], INK: [20, 28, 24] };
    var PT = 0.3528;                    // 1 pt σε mm

    function setFont(bold, size) { doc.setFont('DejaVu', bold ? 'bold' : 'normal'); doc.setFontSize(size); }
    function lineH(size) { return size * PT * 1.38; }
    function wrap(runs, size, width) {  // runs: [{t, b}] → γραμμές από τμήματα {t, b}
      var lines = [[]], x = 0;
      function put(t, b) {
        var l = lines[lines.length - 1], last = l[l.length - 1];
        if (last && last.b === b) last.t += t; else l.push({ t: t, b: b });
      }
      runs.forEach(function (r) {
        setFont(r.b, size);
        String(r.t).split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) {
            if (tok.indexOf('\n') >= 0) { lines.push([]); x = 0; }
            else if (x > 0) { put(' ', r.b); x += doc.getTextWidth(' '); }
            return;
          }
          var tw = doc.getTextWidth(tok);
          if (x + tw > width && x > 0) { lines.push([]); x = 0; }
          while (tw > width) {          // πολύ μακριά λέξη: κόψιμο σε χαρακτήρες
            var k = tok.length;
            while (k > 1 && doc.getTextWidth(tok.slice(0, k)) > width - x) k--;
            put(tok.slice(0, k), r.b); lines.push([]); x = 0;
            tok = tok.slice(k); tw = doc.getTextWidth(tok);
          }
          put(tok, r.b); x += tw;
        });
      });
      return lines.filter(function (l) { return l.length; }).map(function (l) {
        var e = l[l.length - 1]; e.t = e.t.replace(/\s+$/, ''); return l;
      });
    }
    function draw(line, x, y, size, color, center, width) {   // μία γραμμή· τα ♥ ♦ βγαίνουν κόκκινα
      var parts = [], total = 0;
      line.forEach(function (seg) {
        setFont(seg.b, size);
        seg.t.split(/([♥♦])/).forEach(function (t) {
          if (!t) return;
          var pw = doc.getTextWidth(t);
          parts.push({ t: t, b: seg.b, red: t === '♥' || t === '♦', w: pw }); total += pw;
        });
      });
      var cx = center ? x + (width - total) / 2 : x;
      parts.forEach(function (p) {
        setFont(p.b, size);
        doc.setTextColor.apply(doc, p.red ? C.RED : color);
        doc.text(p.t, cx, y);
        cx += p.w;
      });
    }
    function heading(text, x, y0, width) {
      setFont(true, 10); doc.setTextColor.apply(doc, C.GREEN);
      doc.text(text.toUpperCase(), x, y0 + 4.2);
      doc.setDrawColor.apply(doc, C.GREEN); doc.setLineWidth(0.35); doc.line(x, y0 + 5.6, x + width, y0 + 5.6);
    }
    return { doc: doc, C: C, setFont: setFont, lineH: lineH, wrap: wrap, draw: draw, heading: heading };
  }

  return { load: load, begin: begin };
})();
