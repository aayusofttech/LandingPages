

// HOW KAMAO WORKS 
  /* How Kamao works — interactive steps (brands + creators) */
  (function initHowWorks() {
    document.querySelectorAll("[data-how-works]").forEach((root) => {
      const steps = Array.from(root.querySelectorAll("[data-how-works-step]"));
      const image = root.querySelector("[data-how-works-image]");
      const label = root.querySelector("[data-how-works-label]");
      const fill = root.querySelector("[data-how-works-fill]");
      if (!steps.length) return;

      function activate(stepEl) {
        steps.forEach((btn) => {
          const on = btn === stepEl;
          btn.classList.toggle("is-active", on);
          btn.setAttribute("aria-selected", on ? "true" : "false");
        });

        if (label) label.textContent = stepEl.dataset.label || "";
        if (image && stepEl.dataset.image) {
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
  })();
// HOW KAMAO WORKS END