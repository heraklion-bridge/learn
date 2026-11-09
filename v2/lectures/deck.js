/* Ρυθμίσεις του reveal.js για τις διαφάνειες των μαθημάτων.
   Σε οριζόντια οθόνη οι διαφάνειες είναι 1280×720. Σε κατακόρυφη οθόνη (κινητό) χρησιμοποιείται
   ψηλή διάταξη 720×1280, με τις στήλες τη μία κάτω από την άλλη, ώστε τα γράμματα να διαβάζονται. */
(function () {
  function layout() {
    var portrait = window.innerHeight > window.innerWidth;
    document.documentElement.classList.toggle('portrait', portrait);
    return portrait ? { width: 720, height: 1280 } : { width: 1280, height: 720 };
  }

  var size = layout();
  Reveal.initialize({
    hash: true,              // κάθε διαφάνεια έχει δική της διεύθυνση (#/3), ώστε να μπορείτε να τη στείλετε
    width: size.width,
    height: size.height,
    margin: 0.04,
    center: false,
    controls: true,
    progress: true,
    slideNumber: 'c/t',
    transition: 'slide',
    backgroundTransition: 'none',
    help: true,
    previewLinks: false
  });

  window.addEventListener('resize', function () {
    var next = layout();
    if (next.width !== size.width) { size = next; Reveal.configure(next); }
  });
})();
