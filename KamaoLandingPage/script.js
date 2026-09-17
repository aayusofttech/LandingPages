document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll('.visual-features-section .reveal-item');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    // Initial hidden state setup in JS
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.filter = 'blur(5px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease';
    
    observer.observe(el);
  });

  // Inject dynamic listener class handling
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    .visual-features-section .reveal-item.is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
      filter: blur(0px) !important;
    }
  `;
  document.head.appendChild(styleSheet);
});