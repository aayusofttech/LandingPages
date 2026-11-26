// CLOSING CTA 
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ctaSec = document.getElementById('cta');
  var cw = document.getElementById('ctawrap');
  var cc = document.getElementById('ctacard');
  var dotsCanvas = document.getElementById('dots3');

  if (!ctaSec || !cw || !cc) return;

  /* ---------- 1. Soft falling dots on #dots3 ---------- */
  function mkSoft(rgb) {
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(' + rgb + ',.55)');
    g.addColorStop(0.5, 'rgba(' + rgb + ',.18)');
    g.addColorStop(1, 'rgba(' + rgb + ',0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return c;
  }

  function initDots(canvas, density) {
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var softInk = mkSoft('40,70,52');
    var softGold = mkSoft('201,162,74');
    var w = 0, h = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var P = [];
    var vis = true;
    var last = performance.now();
    var rafId = null;

    function mk(initial) {
      var big = Math.random() < 0.1;
      var gold = Math.random() < 0.18;
      var r = big ? (7 + Math.random() * 7) : (0.9 + Math.random() * 3.1);
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20,
        r: r,
        big: big,
        gold: gold,
        vy: 0.12 + Math.random() * 0.5 + (big ? 0 : 0.05),
        vx: (Math.random() - 0.5) * 0.12,
        a: 0.18 + Math.random() * 0.5,
        ph: Math.random() * 6.28,
        tw: 0.4 + Math.random() * 1.1
      };
    }

    function size() {
      var rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      P = [];
      var n = Math.round((w * h) / density);
      for (var i = 0; i < n; i++) P.push(mk(true));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        var a = p.a * (0.75 + 0.25 * Math.sin(t * 0.001 * p.tw + p.ph));
        if (p.big) {
          ctx.globalAlpha = a * 0.9;
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
      rafId = requestAnimationFrame(step);
    }

    size();
    window.addEventListener('resize', size);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        vis = entries[0].isIntersecting;
      }, { rootMargin: '100px' }).observe(canvas);
    }

    if (reduce) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(step);
    }
  }

  initDots(dotsCanvas, 15000);

  /* ---------- 2. Card 3D tilt + orbit parallax ---------- */
  function resetTilt() {
    cc.style.setProperty('--cx', '0deg');
    cc.style.setProperty('--cy', '0deg');
    cc.style.setProperty('--ox', '0px');
    cc.style.setProperty('--oy', '0px');
  }

  if (!reduce) {
    cw.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = cc.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      cc.style.setProperty('--cy', (px * 5).toFixed(2) + 'deg');
      cc.style.setProperty('--cx', (-py * 4).toFixed(2) + 'deg');
      cc.style.setProperty('--ox', (px * -26).toFixed(1) + 'px');
      cc.style.setProperty('--oy', (py * -20).toFixed(1) + 'px');
    });

    cw.addEventListener('pointerleave', resetTilt);
  } else {
    resetTilt();
  }

  /* ---------- 3. Reveal (.rv) + smooth [data-to] scrolling ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    io.observe(cw);
  } else {
    cw.classList.add('in');
  }

  ctaSec.querySelectorAll('[data-to]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('data-to');
      if (!targetId) return;
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
// CLOSING CTA END



// HERO SEcTION MONEY VALUE INCREASE  
(function () {
  const balance = document.querySelector('[data-tick]');

  if (!balance) return;

  let value = parseFloat(balance.dataset.tick);
  const step = parseFloat(balance.dataset.step) || 0;

  setInterval(() => {
    value += step * (0.5 + Math.random());

    balance.textContent =
      'Rs. ' +
      (value / 100).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
  }, 1000);
})();
// HERO SEcTION MONEY VALUE INCREASE END 