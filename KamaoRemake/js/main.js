

 const menuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;

    menuBtn.classList.add("is-open");
    mobileMenu.classList.add("is-open");

    menuBtn.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    menuOpen = false;

    menuBtn.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");

    menuBtn.setAttribute("aria-expanded", "false");

    document.body.classList.remove("menu-open");
  }

  menuBtn.addEventListener("click", () => {
    menuOpen ? closeMenu() : openMenu();
  });


  /* Close after clicking a link */

  document.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });


  /* Close when clicking outside */
  document.addEventListener("click", (event) => {
    if (!menuOpen) return;

    const clickedInsideMenu =
      mobileMenu.contains(event.target);

    const clickedButton =
      menuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      closeMenu();
    }
  });


  /* Escape key */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
    }
  });


  /* Prevent weird state when resizing */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 750 && menuOpen) {
      closeMenu();
    }
  });



