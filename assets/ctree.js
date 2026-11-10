/* Δέντρα αγορών των συμβάσεων (.ctree): προσθέτει κουμπιά «Σύμπτυξη όλων» και «Ανάπτυξη όλων» πάνω από κάθε δέντρο.
   Τα δέντρα είναι απλά <details>, άρα ανοιγοκλείνουν και χωρίς JavaScript. */
(function () {
  'use strict';
  document.querySelectorAll('.ctree').forEach(function (tree, i) {
    // ένα κοινό κουμπί ανά ομάδα διαδοχικών δέντρων: μπαίνει πριν από το πρώτο δέντρο της ομάδας
    var prev = tree.previousElementSibling;
    if (prev && (prev.classList.contains('ctree-bar') || prev.classList.contains('ctree'))) return;
    var bar = document.createElement('div');
    bar.className = 'ctree-bar';
    function mk(label, open) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn--outline sy-small'; b.textContent = label;
      b.addEventListener('click', function () {
        var n = bar.nextElementSibling;
        while (n && n.classList.contains('ctree')) {
          n.querySelectorAll('details').forEach(function (d) { d.open = open; });
          n = n.nextElementSibling;
        }
      });
      return b;
    }
    bar.appendChild(mk('Σύμπτυξη όλων', false));
    bar.appendChild(mk('Ανάπτυξη όλων', true));
    tree.parentNode.insertBefore(bar, tree);
  });
})();
