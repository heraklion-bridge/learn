/* ==========================================================================
   Υπενθύμιση αντιγράφου ασφαλείας (Κάρτα συμβάσεων, Συστήματα).
   Τα δεδομένα μένουν μόνο στον περιηγητή· αν καθαριστούν, χάνονται. Το HBBackup δείχνει ένα διακριτικό μήνυμα με
   κουμπί «Λήψη αρχείου» όταν υπάρχουν αλλαγές που δεν έχουν κατέβει ποτέ ως αρχείο.
     var b = HBBackup.create({ key, get, empty, download, skip });
       key       → κλειδί localStorage όπου θυμόμαστε το τελευταίο αρχείο που κατέβηκε
       get()     → το τρέχον περιεχόμενο ως κείμενο (JSON)
       empty()   → true όταν δεν υπάρχει τίποτα να αποθηκευτεί
       download() → κατεβάζει το αρχείο (και καλεί μετά b.exported())
       skip()    → true όταν δεν χρειάζεται υπενθύμιση (π.χ. βλέπουμε σύστημα από σύνδεσμο)
     b.el  → το στοιχείο που μπαίνει στη σελίδα       b.start() → μετά τη φόρτωση των δεδομένων
     b.changed() → σε κάθε αποθήκευση                   b.exported() → μετά από επιτυχή λήψη
   Το μήνυμα εμφανίζεται μετά από περίπου 8 αλλαγές, ή αμέσως αν υπάρχουν δεδομένα που δεν κατέβηκαν ποτέ.
   ========================================================================== */
window.HBBackup = (function () {
  'use strict';
  function create(o) {
    var exp = '';
    try { exp = localStorage.getItem(o.key) || ''; } catch (e) { /* ιδιωτική περιήγηση */ }
    var changes = 0, lastChange = 0, dismissed = false, neverExported = false;

    function btn(label, cls, fn) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn ' + cls; b.textContent = label;
      b.addEventListener('click', fn);
      return b;
    }
    var box = document.createElement('div');
    box.className = 'callout warn cc-backup';
    box.hidden = true;
    var p = document.createElement('p');
    p.textContent = 'Οι αλλαγές σας υπάρχουν μόνο σε αυτή τη συσκευή. Κατεβάστε ένα αρχείο, για να μην τις χάσετε αν καθαριστούν τα δεδομένα του περιηγητή.';
    var acts = document.createElement('div');
    acts.className = 'cc-backup-acts';
    acts.appendChild(btn('Λήψη αρχείου', 'btn', function () { o.download(); }));
    acts.appendChild(btn('Αργότερα', 'btn--outline', function () { dismissed = true; update(); }));
    box.appendChild(p); box.appendChild(acts);

    function dirty() { return !o.empty() && o.get() !== exp; }
    function update() {
      box.hidden = dismissed || !!(o.skip && o.skip()) || !dirty() || !(changes >= 8 || neverExported);
    }
    return {
      el: box,
      start: function () { neverExported = !exp && !o.empty(); update(); },
      changed: function () {
        var t = Date.now();
        if (t - lastChange > 2000) changes++;     // μια ριπή πληκτρολόγησης μετράει ως μία αλλαγή
        lastChange = t;
        update();
      },
      exported: function () {
        exp = o.get();
        try { localStorage.setItem(o.key, exp); } catch (e) { /* τίποτα */ }
        changes = 0; neverExported = false; dismissed = false;
        update();
      }
    };
  }
  return { create: create };
})();
