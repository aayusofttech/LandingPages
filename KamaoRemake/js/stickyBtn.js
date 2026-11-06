
// app download btn 
(function () {
  var ua = navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) ||
              (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1); // iPad pretending to be a Mac
  var os = isIOS ? 'ios' : isAndroid ? 'android' : 'other';

  document.documentElement.classList.add('os-' + os);
  window.DEVICE_OS = os;

  var bar = document.getElementById('stickybar');
  var contact = document.getElementById('contact');
  var scrolled = false, contactVisible = false, ticking = false;

  function update() {
    // on laptops the "Book a Demo" button is pointless while the contact section is on screen
    var hide = os === 'other' && contactVisible;
    bar.classList.toggle('show', scrolled && !hide);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    scrolled = window.scrollY > 120;
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });

  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      contactVisible = es[0].isIntersecting;
      update();
    }).observe(contact);
  }
  update();
})();
// app download btn end
