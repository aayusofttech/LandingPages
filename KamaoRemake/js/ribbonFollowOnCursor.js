

(function () {
  'use strict';
  if (window.RibbonTrail) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* =====================================================================
     SETTINGS: change these to affect EVERY ribbonFollower section.
     To change just one section, use data attributes on that section:
       data-ribbonFollower-colors="#ff0080,#00e5ff"   data-ribbonFollower-speed="1.5"
       data-ribbonFollower-width="1.2"                data-ribbonFollower-length="1.5"
       data-ribbonFollower-opacity="0.8"              data-ribbonFollower-flutter="0"
       data-ribbonFollower-layer="front"              data-ribbonFollower-blend="lighter"
       data-ribbonFollower-glow="20"
     ===================================================================== */
  var DEFAULTS = {
    colors:  ['#34ec43bd', '#ff6b26a6', '#416744d5'], // COLORS: one per ribbonFollower (hex only gives the fading tail)
    speed:   1,        // SPEED: 0.5 = lazy, 1 = normal, 2 = snappy
    width:   1,        // THICKNESS: 0.5 = thin, 2 = bold
    length:  1,        // TRAIL LENGTH: 0.6 = short, 1.6 = long
    opacity: 1,        // OVERALL OPACITY: 0 to 1
    flutter: 1,        // WAVINESS: 0 = straight, 2 = very wavy
    layer:   'back',   // 'back' = behind your content, 'front' = on top
    blend:   'source-over', // 'lighter' = glow where ribbons overlap
    glow:    0         // GLOW in px, try 15 to 30
  };

  // Ribbon shapes (advanced). head/chain = how tightly it follows; width = max px; offsetY = offset from cursor
  var SHAPES = [
    { points: 28, head: 0.30, chain: 0.34, width: 18, offsetY:  8, phase: 0 },
    { points: 34, head: 0.20, chain: 0.30, width: 24, offsetY: -8, phase: 2 },
    { points: 22, head: 0.13, chain: 0.26, width: 12, offsetY:  0, phase: 4 }
  ];
  /* ===================== end of settings ===================== */

  var instances = [], running = false, last = 0;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function num(v, fallback) { var n = parseFloat(v); return isNaN(n) ? fallback : n; }

  function rgba(hex, a) {
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
    if (!m) return null;
    var h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  function readConfig(host) {
    var c = {}, k, d = host.dataset;
    for (k in DEFAULTS) c[k] = DEFAULTS[k];
    if (d.ribbonColors) c.colors = d.ribbonColors.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    c.speed   = num(d.ribbonSpeed,   c.speed);
    c.width   = num(d.ribbonWidth,   c.width);
    c.length  = num(d.ribbonLength,  c.length);
    c.opacity = num(d.ribbonOpacity, c.opacity);
    c.flutter = num(d.ribbonFlutter, c.flutter);
    c.glow    = num(d.ribbonGlow,    c.glow);
    if (d.ribbonLayer) c.layer = d.ribbonLayer;
    if (d.ribbonBlend) c.blend = d.ribbonBlend;
    return c;
  }

  function setup(host) {
    if (host._ribbonReady) return;
    host._ribbonReady = true;

    var cfg = readConfig(host);
    var canvas = host.querySelector(':scope > canvas');
    if (!canvas) { canvas = document.createElement('canvas'); host.insertBefore(canvas, host.firstChild); }
    canvas.setAttribute('aria-hidden', 'true');

    canvas.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;display:block;pointer-events:none;z-index:' +
                           (cfg.layer === 'front' ? '1' : '-1');
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    if (cfg.layer !== 'front') host.style.isolation = 'isolate';

    var inst = {
      host: host, canvas: canvas, ctx: canvas.getContext('2d'), cfg: cfg,
      w: 0, h: 0, dpr: 1,
      mouse: { x: 0, y: 0 }, client: { x: 0, y: 0 },
      inside: false, alpha: 0, drawn: false, ribbons: []
    };

    cfg.colors.forEach(function (color, i) {
      var s = SHAPES[i % SHAPES.length];
      inst.ribbons.push({ color: color, s: s, n: Math.max(8, Math.round(s.points * cfg.length)), pts: [] });
    });

    function size() {
      var r = host.getBoundingClientRect();
      inst.dpr = Math.min(window.devicePixelRatio || 1, 2);
      inst.w = r.width; inst.h = r.height;
      canvas.width = Math.max(1, Math.round(r.width * inst.dpr));
      canvas.height = Math.max(1, Math.round(r.height * inst.dpr));
      inst.ctx.setTransform(inst.dpr, 0, 0, inst.dpr, 0, 0);
    }
    size();
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(host);
    else window.addEventListener('resize', size);

    function place(e) {
      inst.client.x = e.clientX; inst.client.y = e.clientY;
      var r = host.getBoundingClientRect();
      inst.mouse.x = e.clientX - r.left;
      inst.mouse.y = e.clientY - r.top;
    }
    function reset() {
      inst.ribbons.forEach(function (rb) {
        rb.pts = [];
        for (var i = 0; i < rb.n; i++) rb.pts.push({ x: inst.mouse.x, y: inst.mouse.y + rb.s.offsetY });
      });
    }
    function enter(e) {
      if (e.pointerType === 'touch') return;
      place(e);
      if (!inst.inside) {
        if (inst.alpha < 0.03) reset();
        inst.inside = true;
        start();
      }
    }
    host.addEventListener('pointerenter', enter);
    host.addEventListener('pointermove', enter);
    host.addEventListener('pointerleave', function () { inst.inside = false; });

    instances.push(inst);
  }

  window.addEventListener('scroll', function () {
    instances.forEach(function (inst) {
      if (!inst.inside) return;
      var r = inst.host.getBoundingClientRect();
      inst.mouse.x = inst.client.x - r.left;
      inst.mouse.y = inst.client.y - r.top;
    });
  }, { passive: true });

  function updateRibbon(inst, rb, tx, ty, dt) {
    var s = rb.s, p = rb.pts, sp = inst.cfg.speed, i;
    var kh = 1 - Math.pow(1 - clamp(s.head * sp, 0.01, 0.95), dt * 60);
    var kc = 1 - Math.pow(1 - clamp(s.chain * sp, 0.01, 0.95), dt * 60);
    p[0].x += (tx - p[0].x) * kh;
    p[0].y += (ty + s.offsetY - p[0].y) * kh;
    for (i = 1; i < p.length; i++) {
      p[i].x += (p[i - 1].x - p[i].x) * kc;
      p[i].y += (p[i - 1].y - p[i].y) * kc;
    }
  }

  function drawRibbon(inst, rb, now) {
    var ctx = inst.ctx, cfg = inst.cfg, p = rb.pts, n = p.length, i, total = 0;
    for (i = 1; i < n; i++) total += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
    var g = clamp(total / (110 * cfg.length), 0, 1);
    g = g * g * (3 - 2 * g);
    if (g < 0.02) return;

    var L = [], R = [];
    for (i = 0; i < n; i++) {
      var a = p[Math.max(i - 1, 0)], b = p[Math.min(i + 1, n - 1)];
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len, ny = dx / len, t = i / (n - 1);
      var wave = Math.sin(now * 0.0028 * cfg.speed + i * 0.45 + rb.s.phase) * cfg.flutter * 7 * Math.sin(Math.PI * t) * g;
      var cx = p[i].x + nx * wave, cy = p[i].y + ny * wave;
      var wd = rb.s.width * cfg.width * g * Math.sin(Math.PI * Math.pow(t, 0.7)) / 2;
      L.push({ x: cx + nx * wd, y: cy + ny * wd });
      R.push({ x: cx - nx * wd, y: cy - ny * wd });
    }

    ctx.beginPath();
    ctx.moveTo(L[0].x, L[0].y);
    for (i = 1; i < n - 1; i++) ctx.quadraticCurveTo(L[i].x, L[i].y, (L[i].x + L[i + 1].x) / 2, (L[i].y + L[i + 1].y) / 2);
    ctx.lineTo(L[n - 1].x, L[n - 1].y);
    ctx.lineTo(R[n - 1].x, R[n - 1].y);
    for (i = n - 2; i > 0; i--) ctx.quadraticCurveTo(R[i].x, R[i].y, (R[i].x + R[i - 1].x) / 2, (R[i].y + R[i - 1].y) / 2);
    ctx.lineTo(R[0].x, R[0].y);
    ctx.closePath();

    var c0 = rgba(rb.color, 1);
    if (c0) {
      var grad = ctx.createLinearGradient(p[0].x, p[0].y, p[n - 1].x, p[n - 1].y);
      grad.addColorStop(0, c0);
      grad.addColorStop(0.6, rgba(rb.color, 0.92));
      grad.addColorStop(1, rgba(rb.color, 0));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = rb.color;
    }
    if (cfg.glow > 0) { ctx.shadowColor = rb.color; ctx.shadowBlur = cfg.glow * inst.dpr; }
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function frame(now) {
    var dt = clamp((now - last) / 1000, 0.001, 0.05);
    last = now;
    var anyActive = false;

    instances.forEach(function (inst) {
      var ctx = inst.ctx, cfg = inst.cfg;
      inst.alpha += ((inst.inside ? 1 : 0) - inst.alpha) * (1 - Math.pow(0.88, dt * 60));

      if (!inst.inside && inst.alpha < 0.005) {
        if (inst.drawn) { ctx.clearRect(0, 0, inst.w, inst.h); inst.drawn = false; }
        return;
      }
      anyActive = true;
      ctx.clearRect(0, 0, inst.w, inst.h);
      ctx.globalAlpha = clamp(inst.alpha * cfg.opacity, 0, 1);
      ctx.globalCompositeOperation = cfg.blend;

      var tx = inst.mouse.x + Math.sin(now * 0.0017) * 9 * cfg.flutter;
      var ty = inst.mouse.y + Math.cos(now * 0.0013) * 7 * cfg.flutter;

      inst.ribbons.forEach(function (rb) {
        updateRibbon(inst, rb, tx, ty, dt);
        drawRibbon(inst, rb, now);
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      inst.drawn = true;
    });

    if (anyActive) requestAnimationFrame(frame);
    else running = false;
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  function refresh() { Array.prototype.forEach.call(document.querySelectorAll('.ribbonFollower'), setup); }
  window.RibbonTrail = { refresh: refresh };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh);
  else refresh();
})();




// ----
// (function () {
//   var box = document.getElementById('diag'), where = '-', x = 0, y = 0;
//   document.addEventListener('pointermove', function (e) {
//     var h = e.target.closest && e.target.closest('.ribbonFollower');
//     where = h ? h.getAttribute('data-name') : '-';
//     x = Math.round(e.clientX); y = Math.round(e.clientY);
//   });
//   function tick() {
//     var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     var loaded = !!window.RibbonTrail;
//     var cv = document.querySelectorAll('.ribbonFollower > canvas').length;
//     box.innerHTML =
//       'script: <b class="' + (loaded ? 'ok">loaded' : 'bad">NOT loaded') + '</b><br>' +
//       'reduce motion: <b class="' + (reduce ? 'bad">ON (ribbons off)' : 'ok">off') + '</b><br>' +
//       'canvases: <b>' + cv + '</b><br>' +
//       'mouse over: <b>' + where + '</b> (' + x + ', ' + y + ')';
//   }
//   tick(); setInterval(tick, 250);
// })();

// USAGE : 
// <!-- Section A: defaults -->
// <footer class="footer ribbonFollower">
//   <canvas aria-hidden="true"></canvas>
// </footer>

// <!-- Section B: slower, thinner, mint and yellow -->
// <section class="features ribbonFollower"
//          data-ribbonFollower-colors="#7DE5B2,#F8EE92"
//          data-ribbonFollower-speed="0.7"
//          data-ribbonFollower-width="0.8">
//   <canvas aria-hidden="true"></canvas>
// </section>

// <!-- Section C: neon glow on a dark background, ribbons above the text -->
// <section class="cta ribbonFollower"
//          data-ribbonFollower-colors="#ff2bd6,#00e5ff"
//          data-ribbonFollower-blend="lighter"
//          data-ribbonFollower-glow="20"
//          data-ribbonFollower-layer="front">
//   <canvas aria-hidden="true"></canvas>
// </section>