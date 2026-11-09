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
        { slug: 'anoigma-1xa', title: 'Το άνοιγμα 1ΧΑ', kw: 'ορολογία αγοράς απαντήσεις επαναδήλωση ανοίξαντα 1ΧΑ' },
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

  /* ----- Μπάρα εικονιδίων αριστερά ----- */
  rail: [
    { id: 'home', label: 'Αρχική', href: '', icon: 'spade' },
    { id: 'lectures', label: 'Μαθήματα', href: 'lectures/', icon: 'book' },
    { id: 'quiz', label: 'Quiz', href: 'quiz/', icon: 'check' },
    { id: 'paiktes', label: 'Για παίκτες (σύντομα)', href: 'paiktes/', icon: 'users' }
  ],
  club: { label: 'Σελίδα Ομίλου', href: 'https://www.heraklion-bridge.gr/' },

  /* ----- Υποσέλιδο ----- */
  footer: {
    address: ['Λεωφόρος Δημοκρατίας 73'],
    hours: ['Κυριακή: 19.30-23.00', 'Δευτέρα 19:30-23:00', 'Τετάρτη: 19.30-23.00', 'Πέμπτη 19:30-23:00'],
    emailUser: 'omi', emailDomain: 'hellasbridge.org',   // γραμμένο σε δύο μέρη, ώστε να μην το διαβάζουν τα bots
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
      '<a class="rail-brand" href="' + esc(url('')) + '" aria-label="Μάθε Μπριτζ – αρχική"><img src="' + esc(url('assets/img/logo.png')) + '" width="28" height="28" alt=""></a>' +
      links + '<span class="spacer"></span>' +
      '<a class="rail-link club" href="' + esc(SITE.club.href) + '" aria-label="' + esc(SITE.club.label) + '">' + svg('out') + '<span class="tip">' + esc(SITE.club.label) + '</span></a>';
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
        '<div class="side-group"><div class="side-row soon"><span class="chev-btn"></span><a class="lbl" href="' + esc(url('paiktes/')) + '">Για παίκτες</a><span class="count" style="font-weight:400">σύντομα</span></div></div>' +
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
      out.innerHTML = hits.length ? hits.join('') : '<li class="none">Δεν βρέθηκε τίποτα.</li>';
      out.hidden = false;
    });
    return aside;
  }

  /* ----- υποσέλιδο ----- */
  function buildFooter() {
    var f = SITE.footer;
    var email = f.emailUser + '@' + f.emailDomain;
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
      '<div class="copy">© ' + new Date().getFullYear() + ' Όμιλος Μπριτζ Ηρακλείου (ΟΜΗ) · <a href="https://www.heraklion-bridge.gr/">www.heraklion-bridge.gr</a></div>';
    return footer;
  }

  /* ----- σύνθεση ----- */
  function init() {
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
      icon.innerHTML = svg({ home: 'spade', lectures: 'book', quiz: 'check', paiktes: 'users' }[current] || 'spade');
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
