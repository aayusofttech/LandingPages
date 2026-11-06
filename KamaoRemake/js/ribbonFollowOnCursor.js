
(function () {
  var footer = document.getElementById('footer');
  var canvas = document.getElementById('trail');
  if (!footer || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function size() {
    var r = footer.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  /* ---------- ribbons ---------- */
  function makeRibbon(color, count, headFollow, chainFollow, maxWidth, offsetY) {
    return { color: color, n: count, hf: headFollow, cf: chainFollow,
             maxW: maxWidth, oy: offsetY, pts: [] };
  }
  // drawn in this order, so yellow ends up on top of pink
  var ribbons = [
    makeRibbon('#7ED957', 28, 0.30, 0.34, 18,  8),   // pink
    makeRibbon(' #426340', 34, 0.20, 0.30, 24, -8)    // yellow
  ];

  var mouse = { x: 0, y: 0 };
  var inside = false, alpha = 0, running = false;

  function resetRibbons() {
    ribbons.forEach(function (r) {
      r.pts = [];
      for (var i = 0; i < r.n; i++) r.pts.push({ x: mouse.x, y: mouse.y + r.oy });
    });
  }

  function update(r) {
    var p = r.pts;
    p[0].x += (mouse.x - p[0].x) * r.hf;                 // head chases the mouse
    p[0].y += (mouse.y + r.oy - p[0].y) * r.hf;
    for (var i = 1; i < r.n; i++) {                      // each point chases the one before it
      p[i].x += (p[i - 1].x - p[i].x) * r.cf;
      p[i].y += (p[i - 1].y - p[i].y) * r.cf;
    }
  }

  function draw(r) {
    var p = r.pts, n = r.n, L = [], R = [], total = 0, i;

    for (i = 1; i < n; i++) total += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
    var grow = Math.min(1, total / 150);                 // a still mouse = ribbon melts away

    for (i = 0; i < n; i++) {
      var a = p[Math.max(i - 1, 0)], b = p[Math.min(i + 1, n - 1)];
      var dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      var nx = -dy / len, ny = dx / len;                 // sideways direction
      var t = i / (n - 1);
      var wd = r.maxW * grow * Math.sin(Math.PI * Math.pow(t, 0.7)) / 2;  // thin-thick-thin
      L.push({ x: p[i].x + nx * wd, y: p[i].y + ny * wd });
      R.push({ x: p[i].x - nx * wd, y: p[i].y - ny * wd });
    }

    ctx.beginPath();
    ctx.moveTo(L[0].x, L[0].y);
    for (i = 1; i < n - 1; i++) {
      ctx.quadraticCurveTo(L[i].x, L[i].y, (L[i].x + L[i + 1].x) / 2, (L[i].y + L[i + 1].y) / 2);
    }
    ctx.lineTo(L[n - 1].x, L[n - 1].y);
    ctx.lineTo(R[n - 1].x, R[n - 1].y);
    for (i = n - 2; i > 0; i--) {
      ctx.quadraticCurveTo(R[i].x, R[i].y, (R[i].x + R[i - 1].x) / 2, (R[i].y + R[i - 1].y) / 2);
    }
    ctx.lineTo(R[0].x, R[0].y);
    ctx.closePath();
    ctx.fillStyle = r.color;
    ctx.fill();
  }

  /* ---------- loop (runs only while needed) ---------- */
  function frame() {
    ctx.clearRect(0, 0, w, h);
    alpha += ((inside ? 1 : 0) - alpha) * 0.1;
    ctx.globalAlpha = alpha;
    ribbons.forEach(function (r) { update(r); draw(r); });
    ctx.globalAlpha = 1;

    if (inside || alpha > 0.01) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, w, h); }
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }

  /* ---------- mouse ---------- */
  function setMouse(e) {
    var r = footer.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }
  footer.addEventListener('pointerenter', function (e) {
    if (e.pointerType === 'touch') return;               // no hover on touchscreens
    setMouse(e);
    if (alpha < 0.02) resetRibbons();                    // start fresh at the cursor
    inside = true;
    start();
  });
  footer.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    setMouse(e);
  });
  footer.addEventListener('pointerleave', function () { inside = false; });
})();