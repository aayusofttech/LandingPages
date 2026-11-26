

// HOW KAMAO WORKS 
  /* How Kamao works — interactive steps (brands + creators) */
  // (function initHowWorks() {
  //   document.querySelectorAll("[data-how-works]").forEach((root) => {
  //     const steps = Array.from(root.querySelectorAll("[data-how-works-step]"));
  //     const image = root.querySelector("[data-how-works-image]");
  //     const label = root.querySelector("[data-how-works-label]");
  //     const fill = root.querySelector("[data-how-works-fill]");
  //     if (!steps.length) return;

  //     function activate(stepEl) {
  //       steps.forEach((btn) => {
  //         const on = btn === stepEl;
  //         btn.classList.toggle("is-active", on);
  //         btn.setAttribute("aria-selected", on ? "true" : "false");
  //       });

  //       if (label) label.textContent = stepEl.dataset.label || "";
  //       if (image && stepEl.dataset.image) {
  //         image.src = stepEl.dataset.image;
  //       }

  //       const index = steps.indexOf(stepEl);
  //       if (fill && index >= 0) {
  //         const pct = steps.length <= 1 ? 100 : (index / (steps.length - 1)) * 100;
  //         fill.style.height = `${Math.max(18, pct)}%`;
  //       }
  //     }

  //     steps.forEach((btn) => {
  //       btn.addEventListener("click", () => activate(btn));
  //       btn.addEventListener("mouseenter", () => {
  //         if (window.matchMedia("(hover: hover)").matches) activate(btn);
  //       });
  //     });

  //     const initial = steps.find((s) => s.classList.contains("is-active")) || steps[0];
  //     activate(initial);
  //   });
  // })();


  // HOW KAMAO WORKS
(function initHowWorks() {
  document.querySelectorAll("[data-how-works]").forEach((root) => {
    const steps  = Array.from(root.querySelectorAll("[data-how-works-step]"));
    const image  = root.querySelector("[data-how-works-image]");
    const label  = root.querySelector("[data-how-works-label]");
    const fill   = root.querySelector("[data-how-works-fill]");
    const visual = root.querySelector(".how-brands-visual");
    const stack  = root.querySelector("[data-hb-stack]");
    if (!steps.length) return;

    if (stack) initStack(stack);

    function activate(stepEl) {
      steps.forEach((btn) => {
        const on = btn === stepEl;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });

      if (label) label.textContent = stepEl.dataset.label || "";

      // steps marked data-stack show the card stack; the others swap the image as before
      const useStack = !!stack && stepEl.hasAttribute("data-stack");
      if (visual) visual.classList.toggle("is-stack", useStack);
      if (image && stepEl.dataset.image && !useStack) {
        image.src = stepEl.dataset.image;
      }

      const index = steps.indexOf(stepEl);
      if (fill && index >= 0) {
        const pct = steps.length <= 1 ? 100 : (index / (steps.length - 1)) * 100;
        fill.style.height = `${Math.max(18, pct)}%`;
      }
    }

    steps.forEach((btn) => {
      btn.addEventListener("click", () => activate(btn));
      btn.addEventListener("mouseenter", () => {
        if (window.matchMedia("(hover: hover)").matches) activate(btn);
      });
    });

    const initial = steps.find((s) => s.classList.contains("is-active")) || steps[0];
    activate(initial);
  });

  /* ---------- the card stack ---------- */
  function initStack(stack) {
    const cards = Array.from(stack.querySelectorAll(".hb-card"));
    if (!cards.length) return;
    let order = cards.slice();            // order[0] is the front card
    let startX = null, swiped = false;

    function render() {
      order.forEach((card, i) => {
        card.setAttribute("data-pos", Math.min(i, 4));
        card.style.setProperty("--i", Math.min(i, 4));
        card.setAttribute("aria-current", i === 0 ? "true" : "false");
        card.tabIndex = i > 3 ? -1 : 0;
      });
    }

    function bringToFront(card) {
      if (!card || order[0] === card) return;
      order = [card].concat(order.filter((c) => c !== card));
      card.classList.remove("is-swoop");
      void card.offsetWidth;              // restart the animation if clicked again quickly
      card.classList.add("is-swoop");
      render();
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (swiped) { swiped = false; return; }
        bringToFront(card);
      });
      card.addEventListener("animationend", (e) => {
        if (e.target.classList.contains("hb-inner")) card.classList.remove("is-swoop");
      });
    });

    // swipe: left = next card to the front, right = last card to the front
    stack.addEventListener("pointerdown", (e) => { startX = e.clientX; swiped = false; });
    stack.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) < 45) return;
      swiped = true;
      bringToFront(dx < 0 ? order[1] : order[order.length - 1]);
    });
    stack.addEventListener("pointercancel", () => { startX = null; });

    stack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); bringToFront(order[1]); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { e.preventDefault(); bringToFront(order[order.length - 1]); }
    });

    render();
  }
})();
// HOW KAMAO WORKS END
// HOW KAMAO WORKS END