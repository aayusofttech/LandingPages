
  // NEW 
  // PROGRESS BAR SCROLL 
  (function () {
  var prog = document.getElementById('prog');
  var ticking = false;

  function update() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    prog.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  window.addEventListener('resize', update);
  update(); // set the correct state on load
})();
  // PROGRESS BAR SCROLL END

  // HERO SECTION 
  (function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var body = document.body;
  var hero = $('#hero');

  /* ---------- 1. soft falling dots ---------- */
  function mkSoft(rgb) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(' + rgb + ',.55)');
    g.addColorStop(.5, 'rgba(' + rgb + ',.18)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return c;
  }
  var softInk = mkSoft('40,70,52');
  var softGold = mkSoft('201,162,74');

  function dots(canvas, density) {
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var P = [], vis = true, last = 0;

    function mk(initial) {
      var big = Math.random() < .1, gold = Math.random() < .18;
      var r = big ? (7 + Math.random() * 7) : (.9 + Math.random() * 3.1);
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20,
        r: r, big: big, gold: gold,
        vy: .12 + Math.random() * .5 + (big ? 0 : .05),
        vx: (Math.random() - .5) * .12,
        a: .18 + Math.random() * .5,
        ph: Math.random() * 6.28,
        tw: .4 + Math.random() * 1.1
      };
    }

    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P = [];
      var n = Math.round(w * h / density);
      for (var i = 0; i < n; i++) P.push(mk(true));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        var a = p.a * (.75 + .25 * Math.sin(t * .001 * p.tw + p.ph));
        if (p.big) {
          ctx.globalAlpha = a * .9;
          ctx.drawImage(p.gold ? softGold : softInk, p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4);
        } else {
          ctx.globalAlpha = a;
          ctx.fillStyle = p.gold ? '#C9A24A' : '#2C4A38';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 6.283);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function step(t) {
      if (vis) {
        var dt = Math.min(40, t - last) / 16.7;
        for (var i = 0; i < P.length; i++) {
          var p = P[i];
          p.y += p.vy * dt;
          p.x += p.vx * dt;
          if (p.y > h + 20) P[i] = mk(false);
        }
        draw(t);
      }
      last = t;
      requestAnimationFrame(step);
    }

    size();
    window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { rootMargin: '100px' }).observe(canvas);
    }
    if (reduce) draw(0); else requestAnimationFrame(step);
  }
  dots($('#dots1'), 9000);

  /* ---------- 2. view switching (brands / creators) ---------- */
  function setView(v) {
    if (v !== 'brands' && v !== 'creators') v = 'brands';
    body.setAttribute('data-view', v);
    if (location.hash !== '#' + v) { try { location.hash = v; } catch (e) {} }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () {
    var v = location.hash.replace('#', '');
    if ((v === 'brands' || v === 'creators') && body.getAttribute('data-view') !== v) setView(v);
  });
  var iv = location.hash.replace('#', '');
  body.setAttribute('data-view', iv === 'creators' ? 'creators' : 'brands');

  /* ---------- 3. data-to buttons (scroll to a section) ---------- */
  $$('[data-to]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = a.getAttribute('data-to');
      if (t === 'brands' || t === 'creators') { setView(t); return; }
      if (t === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      var el = document.getElementById(t);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- 4. mouse depth on the hero ---------- */
  if (!reduce) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', (((e.clientX - r.left) / r.width - .5) * 2).toFixed(3));
      hero.style.setProperty('--py', (((e.clientY - r.top) / r.height - .5) * 2).toFixed(3));
    });
  }

  /* ---------- 5. balance ticker ---------- */
  var ticks = $$('[data-tick]');
  ticks.forEach(function (el) { el._v = parseFloat(el.getAttribute('data-tick')); });
  if (!reduce) {
    setInterval(function () {
      ticks.forEach(function (el) {
        el._v += parseFloat(el.getAttribute('data-step')) * (.5 + Math.random());
        el.textContent = 'Rs. ' + (el._v / 100).toLocaleString('en-IN', {
          minimumFractionDigits: 2, maximumFractionDigits: 2
        });
      });
    }, 2200);
  }

  /* ---------- 6. scroll values for the hero ---------- */
  var tick = false;
  function onScroll() {
    var y = window.scrollY;
    hero.style.setProperty('--sy', Math.min(y, 900));
    hero.style.setProperty('--sr', reduce ? 0 : Math.min(y / 900, 1) * 14);
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- 7. pause SVG ribbons ---------- */
  var rsv = $('.ribbons svg');
  if (rsv) {
    if (reduce) {
      try { rsv.pauseAnimations(); } catch (e) {}
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        try { es[0].isIntersecting ? rsv.unpauseAnimations() : rsv.pauseAnimations(); } catch (e) {}
      }, { rootMargin: '80px' }).observe(hero);
    }
  }
})();
  // HERO SECTION END 






// TIME LOOP 
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- 1. falling dots (#dots2) ---------- */
  function mkSoft(rgb) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(' + rgb + ',.55)');
    g.addColorStop(.5, 'rgba(' + rgb + ',.18)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return c;
  }
  var softInk = mkSoft('40,70,52'), softGold = mkSoft('201,162,74');

  function dots(canvas, density) {
    var ctx = canvas.getContext('2d');
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var P = [], vis = true, last = 0;

    function mk(initial) {
      var big = Math.random() < .1, gold = Math.random() < .18;
      var r = big ? (7 + Math.random() * 7) : (.9 + Math.random() * 3.1);
      return {
        x: Math.random() * w, y: initial ? Math.random() * h : -20,
        r: r, big: big, gold: gold,
        vy: .12 + Math.random() * .5 + (big ? 0 : .05),
        vx: (Math.random() - .5) * .12,
        a: .18 + Math.random() * .5,
        ph: Math.random() * 6.28, tw: .4 + Math.random() * 1.1
      };
    }
    function size() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P = [];
      var n = Math.round(w * h / density);
      for (var i = 0; i < n; i++) P.push(mk(true));
    }
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < P.length; i++) {
        var p = P[i], a = p.a * (.75 + .25 * Math.sin(t * .001 * p.tw + p.ph));
        if (p.big) {
          ctx.globalAlpha = a * .9;
          ctx.drawImage(p.gold ? softGold : softInk, p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4);
        } else {
          ctx.globalAlpha = a;
          ctx.fillStyle = p.gold ? '#C9A24A' : '#2C4A38';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function step(t) {
      if (vis) {
        var dt = Math.min(40, t - last) / 16.7;
        for (var i = 0; i < P.length; i++) {
          var p = P[i];
          p.y += p.vy * dt; p.x += p.vx * dt;
          if (p.y > h + 20) P[i] = mk(false);
        }
        draw(t);
      }
      last = t;
      requestAnimationFrame(step);
    }
    size();
    window.addEventListener('resize', size);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }, { rootMargin: '100px' }).observe(canvas);
    }
    if (reduce) draw(0); else requestAnimationFrame(step);
  }
  dots($('#dots2'), 12000);

  /* ---------- 2. dial tick marks ---------- */
  var tg = $('#ticks');
  (function () {
    var html = '', cx = 250, cy = 250;
    for (var i = 0; i < 120; i++) {
      var a = i * 3 * Math.PI / 180;
      var major = i % 10 === 0, mid = i % 5 === 0;
      var r1 = major ? 206 : (mid ? 216 : 224), r2 = 232;
      html += '<line x1="' + (cx + Math.sin(a) * r1).toFixed(1) +
              '" y1="' + (cy - Math.cos(a) * r1).toFixed(1) +
              '" x2="' + (cx + Math.sin(a) * r2).toFixed(1) +
              '" y2="' + (cy - Math.cos(a) * r2).toFixed(1) +
              '" stroke="' + (major ? '#B58A2A' : 'rgba(22,32,26,.4)') +
              '" stroke-width="' + (major ? 3 : 1.4) + '"/>';
    }
    tg.innerHTML = html;
  })();

  /* ---------- 3. scroll progress of this section ---------- */
  var dialSec = $('#dial'), dialEl = $('#dialEl');
  var legs = $$('#legend .leg'), phases = $$('.phase');

  function prog(sec) {
    var r = sec.getBoundingClientRect();
    if (!r.height) return null;
    var total = r.height - window.innerHeight;
    return clamp(-r.top / total, 0, 1);
  }
  function fmtK(v) { return v >= 1000 ? (v / 1000).toFixed(1) + 'K' : String(Math.round(v)); }

  /* ---------- 4. update everything from p ---------- */
  function renderDial() {
    var p = prog(dialSec);
    if (p === null) return;

    var ang = p * 1080;                       // 3 full turns
    dialEl.style.setProperty('--ang', ang.toFixed(1));

    var q = Math.floor(((ang % 360) + 360) % 360 / 90);   // quarter 0..3
    legs.forEach(function (l, k) { l.classList.toggle('on', k === q); });
    phases.forEach(function (l, k) { l.classList.toggle('on', k === q); });

    $('#sd1').style.setProperty('--sa', (p * 2160).toFixed(0));
    $('#sd2').style.setProperty('--sa', (p * -1440).toFixed(0));
    $('#sd3').style.setProperty('--sa', (p * 3240).toFixed(0));

    $('#dv1').textContent = Math.round(212 * p);
    $('#dv2').textContent = Math.round(150 * p);
    $('#dv3').textContent = fmtK(24600 * p);
  }

  var ticking = false;
  function onScroll() { renderDial(); ticking = false; }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
// TIME LOOP END



// MAGNETC CTA 
document.addEventListener("DOMContentLoaded", function () {
  const finalSection = document.querySelector(".fbox.rv");

  if (!finalSection) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18
    });

    observer.observe(finalSection);
  } else {
    finalSection.classList.add("in");
  }
});
// MAGNETC CTA END

// CONTACT US 
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.rv'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target); // play once
        }
      });
    }, { threshold: .15 });

    items.forEach(function (el) { io.observe(el); });
  } else {
    // old browsers: just show everything
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
// CONTACT US END
