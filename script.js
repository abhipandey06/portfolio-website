const $ = (sel) => document.querySelector(sel);

function animateCounter(el, target, duration = 900) {
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (target - start) * progress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    counters.forEach((el) => (el.textContent = el.dataset.counter));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const el = e.target;
          const target = Number(el.dataset.counter || "0");
          animateCounter(el, target);
          io.unobserve(el);
        }
      }
    },
    { threshold: 0.3 }
  );

  counters.forEach((el) => io.observe(el));
}

function setupMobileMenu() {
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");
  if (!menuBtn || !mobileMenu) return;

  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.hidden = !isMenuOpen;
    menuBtn.setAttribute("aria-expanded", String(isMenuOpen));

    if (isMenuOpen) {
      menuBtn.setAttribute("aria-label", "Close menu");
      menuBtn.textContent = "✕";
    } else {
      menuBtn.setAttribute("aria-label", "Open menu");
      menuBtn.textContent = "☰";
    }
  };

  menuBtn.addEventListener("click", toggleMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", toggleMenu);
  });
}

setupCounters();
setupMobileMenu();