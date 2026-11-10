/* ==========================================================================
   Μάθε Μπριτζ – Όμιλος Μπριτζ Ηρακλείου – κοινή διάταξη (v2)
   --------------------------------------------------------------------------
   Αυτό που θα αλλάζετε συχνότερα βρίσκεται στο μπλοκ SITE από κάτω:
     • cycles → οι κύκλοι μαθημάτων και οι ενότητές τους (τίτλος, λέξεις για την αναζήτηση).
                Εμφανίζονται στο πλευρικό μενού ως «Μαθήματα → Α κύκλος» και «Quiz → Α' κύκλος».
     • rail   → τα εικονίδια της μπάρας αριστερά.
     • footer → διεύθυνση, ώρες, e-mail, τηλέφωνα.
   Οι διευθύνσεις γράφονται σχετικά με τη ρίζα του site (π.χ. 'quiz/'). Μια πλήρης
   διεύθυνση που αρχίζει με https:// χρησιμοποιείται όπως είναι.
   ========================================================================== */

const SITE = {

  /* ----- Κύκλοι μαθημάτων, με τις ενότητές τους (σειρά διδασκαλίας) -----
     Κάθε κύκλος έχει δική του σελίδα (lectures/<slug>/ και quiz/<slug>/) και εμφανίζεται ως υπομενού
     στα «Μαθήματα» και στα «Quiz». Οι ενότητες έχουν διευθύνσεις lectures/<unit>/ και quiz/<unit>/. */
  cycles: [
    {
      slug: 'a-kyklos', lectures: 'Α κύκλος', quiz: 'Α\' κύκλος',
      units: [
        { slug: 'vasika-tou-mpritz', title: 'Τα βασικά του μπριτζ', kw: 'παίκτες τράπουλα διανομή αγορά συμβόλαιο λεβέ ατού τσάκα' },
        { slug: 'kanones-agoras', title: 'Κανόνες αγοράς και οδηγίες παιξίματος', kw: 'ιεραρχία αγορών συμβόλαιο εκτελεστής λεβέ οδηγίες παιξίματος' },
        { slug: 'epilogi-symvolaiou', title: 'Αρχές επιλογής συμβολαίου', kw: 'σκορ μπόνους φιτ δύναμη χεριού ονέρ κατανομή ιδανικό συμβόλαιο' },
        { slug: 'anoigma-1xa', title: 'Το άνοιγμα 1NT', kw: 'ορολογία αγοράς απαντήσεις επαναδήλωση ανοίξαντα 1NT' },
        { slug: 'technikes-ektelesis', title: 'Τεχνικές εκτέλεσης, άμυνα, σινιάλα διάθεσης', kw: 'πλάνο ΑΒΓ προαγωγή ονέρ μαιτράρισμα αντάμ άμυνα σινιάλα διάθεσης' },
        { slug: 'anoigma-1-mazer', title: 'Άνοιγμα 1 σε μαζέρ', kw: '1Μ κούπες πίκες απαντήσεις επαναδήλωση δεύτερη απάντηση' },
        { slug: 'xemplokarisma-chromatista', title: 'Ξεμπλοκάρισμα, τεχνικές για χρωματιστά συμβόλαια', kw: 'ξεμπλοκάρισμα χανόμενες τσάκες πλάνο ΑΒΓ σινιάλο θέλω' },
        { slug: 'anoigma-1-miner', title: 'Άνοιγμα 1 σε μινέρ', kw: '1μ σπαθιά καρά απαντήσεις επαναδήλωση δεύτερη απάντηση' }
      ]
    }
  ],

  /* ----- Οι δύο κεντρικές ενότητες (το κουμπί αριστερά και το πρώτο επίπεδο του μενού) ----- */
  sections: {
    lectures: { label: 'Μαθήματα', kind: 'Διαφάνειες', dir: 'lectures/' },
    quiz: { label: 'Quiz', kind: 'Κουίζ', dir: 'quiz/' }
  },

  /* ----- Για παίκτες: ενότητες και σελίδες τους ----- */
  players: {
    label: 'Για παίκτες', dir: 'paiktes/',
    sections: [      /* υποενότητες με λίστα σελίδων: { label, dir, items: [{ slug, title, kw }] } */
    ],
    /* σελίδες που βρίσκονται απευθείας κάτω από το «Για παίκτες» */
    pages: [
      { slug: 'karta-symvaseon', title: 'Κάρτα συμβάσεων', kw: 'κάρτα συμβάσεων convention card εκτύπωση pdf σύστημα σινιάλα' },
      { slug: 'systimata', title: 'Συστήματα', kw: 'συστήματα σύστημα αγοράς δέντρο δηλώσεων bidding system εκτύπωση pdf' }
    ]
  },

  /* ----- Συμβάσεις: ομάδες συμβάσεων και οι σελίδες τους (symvaseis/<ομάδα>/<σύμβαση>/) ----- */
  conventions: {
    label: 'Συμβάσεις', dir: 'symvaseis/',
    groups: [
      {
        slug: 'meta-anoigma-1nt', label: 'Μετά από άνοιγμα 1NT',
        items: [
          { slug: 'stayman', title: 'Stayman', kw: 'stayman 2♣ 4φ τετράφυλλο μαζέρ απάντηση 1NT συμβατική' },
          { slug: 'jacoby-transfer', title: '2♦/♥ Jacoby transfer', kw: 'jacoby transfer μεταφορά 2♦ 2♥ 5φ πεντάφυλλο μαζέρ 1NT συμβατική' },
          { slug: 'lebensohl', title: 'Lebensohl', kw: 'lebensohl lebenshol παρεμβολή παρέμβαση επέμβαση αντίπαλοι 2NT 3♣ στοπ cue bid 1NT συμβατική' }
        ]
      }
    ]
  },

  /* ----- Μπάρα εικονιδίων αριστερά ----- */
  rail: [
    { id: 'home', label: 'Αρχική', href: '', icon: 'spade' },
    { id: 'lectures', label: 'Μαθήματα', href: 'lectures/', icon: 'book' },
    { id: 'quiz', label: 'Quiz', href: 'quiz/', icon: 'check' },
    { id: 'paiktes', label: 'Για παίκτες', href: 'paiktes/', icon: 'users' },
    { id: 'symvaseis', label: 'Συμβάσεις', href: 'symvaseis/', icon: 'tree' }
  ],
  club: { label: 'Σελίδα Ομίλου', href: 'https://www.heraklion-bridge.gr/' },

  /* ----- Υποσέλιδο ----- */
  footer: {
    address: ['Λεωφόρος Δημοκρατίας 73'],
    hours: ['Κυριακή, Δευτέρα, Τετάρτη, Πέμπτη: 19:30–23:00'],
    emailUser: 'omi', emailDomain: 'hellasbridge.org',   // γραμμένο σε δύο μέρη, ώστε να μην το διαβάζουν τα bots
    // επικοινωνία για προβλήματα / λάθη: το e-mail δεν υπάρχει πουθενά στο HTML, φτιάχνεται από το JavaScript (και αυτό σε δύο μέρη)
    reportName: 'τον κ. Καμαριανάκη Μάνο', reportUser: 'm.kamarianakis', reportDomain: 'gmail.com',
    facebook: 'http://fb.com/HeraklionBridgeClub',
    instagram: 'https://www.instagram.com/heraklionbridgeclub/',
    social: 'HeraklionBridgeClub',
    phones: [
      { name: 'Κωτσόπουλος Γιάννης', tel: '+30 6936852562' },
      { name: 'Σαράντου Εύα-Μαρίνα', tel: '+30 6944814373' },
      { name: 'Σαράτσης Φίλιππος', tel: '+30 6974412988' }
    ]
  }
};

/* ==========================================================================
   Από εδώ και κάτω: ο κώδικας που ζωγραφίζει τη διάταξη. Δεν χρειάζεται αλλαγή.
   ========================================================================== */
(function () {
  'use strict';

  var script = document.currentScript;
  var ROOT = script ? script.src.replace(/assets\/site\.js(\?.*)?$/, '') : '/';
  var path = decodeURIComponent(location.pathname);
  var rootPath = decodeURIComponent(new URL(ROOT).pathname);
  var here = path.indexOf(rootPath) === 0 ? path.slice(rootPath.length) : path;
  here = here.replace(/index\.html$/, '');
  var current = here === '' ? 'home' : here.split('/')[0];

  var ICON = {
    spade: '<path d="M12 2.5c-3 4.6-8 6.9-8 11.4a4.1 4.1 0 0 0 7.2 2.7c-.2 2-.8 3.7-2.2 4.9h6c-1.4-1.2-2-2.9-2.2-4.9a4.1 4.1 0 0 0 7.2-2.7c0-4.5-5-6.8-8-11.4z"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    out: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    tree: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 8.5v7M8.5 6H12a4 4 0 0 1 4 4v.5M8.5 18H12a4 4 0 0 0 4-4v-.5"/>',
    chev: '<path d="m9 18 6-6-6-6"/>'
  };
  function svg(name, cls) {
    return '<svg class="' + (cls || 'ico-lg') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function url(href) { return /^https?:\/\//.test(href) ? href : encodeURI(ROOT + href); }
  function num(i) { return (i < 9 ? '0' : '') + (i + 1); }
  function plain(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ς/g, 'σ'); }

  /* ----- μπάρα εικονιδίων ----- */
  function buildRail() {
    var links = SITE.rail.map(function (r) {
      return '<a class="rail-link' + (r.id === current ? ' current' : '') + '" href="' + esc(url(r.href)) + '" aria-label="' + esc(r.label) + '"' + (r.id === current ? ' aria-current="page"' : '') + '>' +
        svg(r.icon) + '<span class="tip">' + esc(r.label) + '</span></a>';
    }).join('');
    var rail = document.createElement('nav');
    rail.className = 'rail';
    rail.setAttribute('aria-label', 'Κύριο μενού');
    rail.innerHTML =
      links + '<span class="spacer"></span>' +
      '<a class="rail-link club" href="' + esc(SITE.club.href) + '" aria-label="' + esc(SITE.club.label) + '"><img src="' + esc(url('assets/img/logo.png')) + '" width="34" height="34" alt=""><span class="tip">' + esc(SITE.club.label) + '</span></a>';
    return rail;
  }

  /* ----- πλευρικό μενού «Υλικό» ----- */
  function row(href, label, count, isCurrent, isOpen) {
    return '<div class="side-row' + (isCurrent ? ' current' : '') + '">' +
      '<button type="button" class="chev-btn" aria-expanded="' + isOpen + '" aria-label="Άνοιγμα / κλείσιμο: ' + esc(label) + '">' + svg('chev', 'chev') + '</button>' +
      '<a class="lbl" href="' + esc(url(href)) + '"' + (isCurrent ? ' aria-current="page"' : '') + '>' + esc(label) + '</a>' +
      '<span class="count">' + count + '</span></div>';
  }
  function unitCount(cycles) { return cycles.reduce(function (n, c) { return n + c.units.length; }, 0); }

  function playersGroup() {
    var pl = SITE.players;
    var open = current === 'paiktes';
    var nest = pl.sections.map(function (sec) {
      var secOpen = here.indexOf(sec.dir) === 0;
      var items = sec.items.map(function (it, i) {
        var href = sec.dir + it.slug + '/';
        return '<li><a href="' + esc(url(href)) + '"' + (here === href ? ' class="current" aria-current="page"' : '') + '><b>' + num(i) + '</b> ' + esc(it.title) + '</a></li>';
      }).join('');
      return '<div class="side-group' + (secOpen ? ' open' : '') + '">' + row(sec.dir, sec.label, sec.items.length, here === sec.dir, secOpen) + '<ul class="side-sub">' + items + '</ul></div>';
    }).join('');
    nest += pl.pages.map(function (pg) {
      var href = pl.dir + pg.slug + '/';
      var cur = here === href;
      return '<div class="side-group"><div class="side-row' + (cur ? ' current' : '') + '"><span class="chev-btn"></span><a class="lbl" href="' + esc(url(href)) + '"' + (cur ? ' aria-current="page"' : '') + '>' + esc(pg.title) + '</a></div></div>';
    }).join('');
    var total = pl.sections.reduce(function (n, sec) { return n + sec.items.length; }, 0) + pl.pages.length;
    return '<div class="side-group' + (open ? ' open' : '') + '">' + row(pl.dir, pl.label, total, here === pl.dir, open) + '<div class="side-nest">' + nest + '</div></div>';
  }

  function conventionsGroup() {
    var cv = SITE.conventions;
    var open = current === 'symvaseis';
    var nest = cv.groups.map(function (g) {
      var gHref = cv.dir + g.slug + '/';
      var gOpen = here.indexOf(gHref) === 0;
      var items = g.items.map(function (it, i) {
        var href = gHref + it.slug + '/';
        return '<li><a href="' + esc(url(href)) + '"' + (here === href ? ' class="current" aria-current="page"' : '') + '><b>' + num(i) + '</b> ' + esc(it.title) + '</a></li>';
      }).join('');
      return '<div class="side-group' + (gOpen ? ' open' : '') + '">' + row(gHref, g.label, g.items.length, here === gHref, gOpen) + '<ul class="side-sub">' + items + '</ul></div>';
    }).join('');
    var total = cv.groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    return '<div class="side-group' + (open ? ' open' : '') + '">' + row(cv.dir, cv.label, total, here === cv.dir, open) + '<div class="side-nest">' + nest + '</div></div>';
  }

  function buildSide() {
    var groups = ['lectures', 'quiz'].map(function (key) {
      var sec = SITE.sections[key];
      var secOpen = current === key;
      var nest = SITE.cycles.map(function (cy) {
        var cyHref = sec.dir + cy.slug + '/';
        var cyOpen = here === cyHref || cy.units.some(function (u) { return here === sec.dir + u.slug + '/'; });
        var items = cy.units.map(function (u, i) {
          var href = sec.dir + u.slug + '/';
          return '<li><a href="' + esc(url(href)) + '"' + (here === href ? ' class="current" aria-current="page"' : '') + '><b>' + num(i) + '</b> ' + esc(u.title) + '</a></li>';
        }).join('');
        return '<div class="side-group' + (cyOpen ? ' open' : '') + '">' + row(cyHref, cy[key], cy.units.length, here === cyHref, cyOpen) + '<ul class="side-sub">' + items + '</ul></div>';
      }).join('');
      return '<div class="side-group' + (secOpen ? ' open' : '') + '">' + row(sec.dir, sec.label, unitCount(SITE.cycles), here === sec.dir, secOpen) + '<div class="side-nest">' + nest + '</div></div>';
    }).join('');

    var aside = document.createElement('aside');
    aside.className = 'side';
    aside.setAttribute('aria-label', 'Υλικό');
    aside.innerHTML =
      '<nav class="side-card" aria-label="Υλικό"><h2>Υλικό</h2>' + groups +
        playersGroup() +
        conventionsGroup() +
      '</nav>' +
      '<div class="side-search" role="search">' + svg('search', 'ico-lg') +
        '<input type="search" placeholder="Αναζήτηση" aria-label="Αναζήτηση στο υλικό" autocomplete="off">' +
        '<ul class="search-results" hidden></ul></div>';

    aside.querySelectorAll('.chev-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.closest('.side-group').classList.toggle('open');
        b.setAttribute('aria-expanded', open);
      });
    });

    var input = aside.querySelector('input');
    var out = aside.querySelector('.search-results');
    input.addEventListener('input', function () {
      var q = plain(input.value.trim());
      if (!q) { out.hidden = true; out.innerHTML = ''; return; }
      var terms = q.split(/\s+/);
      var hits = [];
      ['lectures', 'quiz'].forEach(function (key) {
        var sec = SITE.sections[key];
        SITE.cycles.forEach(function (cy) {
          cy.units.forEach(function (u, i) {
            var hay = plain(u.title + ' ' + u.kw + ' ' + sec.kind + ' ' + cy[key] + ' ' + num(i));
            if (terms.every(function (t) { return hay.indexOf(t) !== -1; })) {
              hits.push('<li><a href="' + esc(url(sec.dir + u.slug + '/')) + '">' + esc(u.title) + '<small>' + esc(sec.kind) + ' · ' + esc(cy[key]) + ' · Ενότητα ' + num(i) + '</small></a></li>');
            }
          });
        });
      });
      SITE.players.sections.forEach(function (sec) {
        sec.items.forEach(function (it, i) {
          if (terms.every(function (t) { return plain(it.title + ' ' + it.kw + ' ' + sec.label).indexOf(t) !== -1; })) {
            hits.push('<li><a href="' + esc(url(sec.dir + it.slug + '/')) + '">' + esc(it.title) + '<small>' + esc(SITE.players.label) + ' · ' + esc(sec.label) + '</small></a></li>');
          }
        });
      });
      SITE.players.pages.forEach(function (pg) {
        if (terms.every(function (t) { return plain(pg.title + ' ' + pg.kw).indexOf(t) !== -1; })) {
          hits.push('<li><a href="' + esc(url(SITE.players.dir + pg.slug + '/')) + '">' + esc(pg.title) + '<small>' + esc(SITE.players.label) + '</small></a></li>');
        }
      });
      SITE.conventions.groups.forEach(function (g) {
        g.items.forEach(function (it) {
          if (terms.every(function (t) { return plain(it.title + ' ' + it.kw + ' ' + g.label + ' ' + SITE.conventions.label).indexOf(t) !== -1; })) {
            hits.push('<li><a href="' + esc(url(SITE.conventions.dir + g.slug + '/' + it.slug + '/')) + '">' + esc(it.title) + '<small>' + esc(SITE.conventions.label) + ' · ' + esc(g.label) + '</small></a></li>');
          }
        });
      });
      out.innerHTML = hits.length ? hits.join('') : '<li class="none">Δεν βρέθηκε τίποτα.</li>';
      out.hidden = false;
    });
    return aside;
  }

  /* ----- υποσέλιδο ----- */
  function buildFooter() {
    var f = SITE.footer;
    var email = f.emailUser + '@' + f.emailDomain;
    var report = f.reportUser + '@' + f.reportDomain;
    var phones = f.phones.map(function (p) {
      return '<li>' + esc(p.name) + ' · <a href="tel:' + esc(p.tel.replace(/\s+/g, '')) + '">' + esc(p.tel) + '</a></li>';
    }).join('');
    var footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="cols">' +
        '<div><h2>Που βρισκόμαστε</h2>' + f.address.map(esc).join('<br>') + '<br>' + f.hours.map(esc).join(' · ') + '</div>' +
        '<div><h2>Επικοινωνία</h2><ul>' +
          '<li><a href="mailto:' + esc(email) + '">' + esc(email) + '</a></li>' +
          '<li><a href="' + esc(f.facebook) + '" rel="noopener">Facebook · ' + esc(f.social) + '</a></li>' +
          '<li><a href="' + esc(f.instagram) + '" rel="noopener">Instagram · ' + esc(f.social) + '</a></li></ul></div>' +
        '<div><h2>Τηλέφωνα</h2><ul>' + phones + '</ul></div>' +
      '</div>' +
      '<p class="report">Εάν εντοπίσατε κάποιο πρόβλημα ή λάθος επικοινωνήστε με ' + esc(f.reportName) + ' (<a href="mailto:' + esc(report) + '">' + esc(report) + '</a>)</p>' +
      '<div class="copy">© ' + new Date().getFullYear() + ' Όμιλος Μπριτζ Ηρακλείου (ΟΜΗ) · <a href="https://www.heraklion-bridge.gr/">www.heraklion-bridge.gr</a><br>Ανώνυμα στατιστικά χρήσης, χωρίς cookies.</div>';
    return footer;
  }

  function loadStats() {
    var st = document.createElement('script');
    st.src = ROOT + 'assets/stats.js';
    document.head.appendChild(st);
  }

  /* ----- σύνθεση ----- */
  function init() {
    loadStats();
    var main = document.getElementById('main');
    if (!main) return;

    var shell = document.createElement('div');
    shell.className = 'shell';
    var inner = document.createElement('div');
    inner.className = 'shell-in';
    shell.appendChild(inner);

    var h1 = main.querySelector('h1');
    if (h1) {
      var head = document.createElement('header');
      head.className = 'page-head';
      var crumbs = main.querySelector('.crumbs');
      if (crumbs) head.appendChild(crumbs);
      var icon = document.createElement('span');
      icon.className = 'page-icon';
      icon.innerHTML = svg({ home: 'spade', lectures: 'book', quiz: 'check', paiktes: 'users', symvaseis: 'tree' }[current] || 'spade');
      head.appendChild(icon);
      head.appendChild(h1);
      inner.appendChild(head);
    }

    var cols = document.createElement('div');
    cols.className = 'shell-cols';
    main.parentNode.insertBefore(shell, main);
    cols.appendChild(main);
    cols.appendChild(buildSide());
    inner.appendChild(cols);
    shell.appendChild(buildFooter());

    var skip = document.createElement('a');
    skip.className = 'skip';
    skip.href = '#main';
    skip.textContent = 'Μετάβαση στο περιεχόμενο';
    document.body.insertBefore(skip, document.body.firstChild);
    document.body.insertBefore(buildRail(), skip.nextSibling);
    document.body.classList.add('ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
