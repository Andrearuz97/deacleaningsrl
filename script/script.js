// ===========================
// NAVBAR MOBILE TOGGLE
// ===========================
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  const toggleIcon = navToggle.querySelector("i");

  const closeMenu = () => {
    navLinks.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    if (toggleIcon) {
      toggleIcon.classList.remove("fa-xmark");
      toggleIcon.classList.add("fa-bars");
    }
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (toggleIcon) {
      toggleIcon.classList.toggle("fa-bars", !isOpen);
      toggleIcon.classList.toggle("fa-xmark", isOpen);
    }
  });

  // Chiudi il menu quando clicchi su un link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // CHIUSURA MENU CLICCANDO FUORI
  document.addEventListener("click", (e) => {
    const isMenuOpen = navLinks.classList.contains("show");
    if (!isMenuOpen) return;

    const clickedInsideMenu = navLinks.contains(e.target);
    const clickedToggle = navToggle.contains(e.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  // Chiudi con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===========================
// FOOTER YEAR
// ===========================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===========================
// ANIMAZIONI SU SCROLL
// ===========================
const animatedEls = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window && animatedEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  animatedEls.forEach((el) => observer.observe(el));
} else {
  animatedEls.forEach((el) => el.classList.add("is-visible"));
}

// ===========================
// LINK NAVBAR ATTIVO
// ===========================
const sections = document.querySelectorAll("section[id]");
const navLinksAnchors = document.querySelectorAll(".nav-links a[href^='#']");

if ("IntersectionObserver" in window && sections.length && navLinksAnchors.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        navLinksAnchors.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    {
      root: null,
      threshold: 0.4,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// ===========================
// BOTTONE TORNA SU
// ===========================
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    backToTop.blur();
  });
}

// ===========================
// COOKIE BANNER
// ===========================
const cookieBanner = document.getElementById("cookie-banner");
const cookieAccept = document.getElementById("cookie-accept");

if (cookieBanner && cookieAccept) {
  const COOKIES_KEY = "dea_cleaning_cookies_accepted";

  if (localStorage.getItem(COOKIES_KEY) === "true") {
    cookieBanner.style.display = "none";
  }

  cookieAccept.addEventListener("click", () => {
    localStorage.setItem(COOKIES_KEY, "true");
    cookieBanner.style.display = "none";
  });
}

// ===========================
// CAROSELLO RECENSIONI
// ===========================
(function () {
  const carousel = document.querySelector(".reviews-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".reviews-track");
  const slides = Array.from(carousel.querySelectorAll(".review-card"));
  const prevBtn = carousel.querySelector(".reviews-prev");
  const nextBtn = carousel.querySelector(".reviews-next");
  const dotsContainer = carousel.querySelector(".reviews-dots");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000; // 6 secondi

  // Crea i pallini in base al numero di slide
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "reviews-dot";
    dot.dataset.index = String(index);
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".reviews-dot"));

  function updateSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goNext() {
    updateSlide(currentIndex + 1);
  }

  function goPrev() {
    updateSlide(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goNext, AUTOPLAY_DELAY);
  }

  function userNavigate(fn) {
    fn();
    startAutoplay(); // reset autoplay dopo interazione
  }

  // Eventi frecce (bottoni)
  if (nextBtn) {
    nextBtn.addEventListener("click", () => userNavigate(goNext));
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => userNavigate(goPrev));
  }

  // Eventi pallini
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.dataset.index || "0");
      userNavigate(() => updateSlide(idx));
    });
  });

  // ===========================
  // SWIPE TOUCH (MOBILE)
  // ===========================
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchSwiping = false;

  carousel.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isTouchSwiping = true;
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isTouchSwiping || !e.touches || e.touches.length === 0) return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    // Swipe orizzontale netto
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      e.preventDefault(); // blocca scroll verticale mentre swipi

      if (dx < 0) {
        userNavigate(goNext);
      } else {
        userNavigate(goPrev);
      }

      isTouchSwiping = false; // evita multiple slide
    }
  });

  carousel.addEventListener("touchend", () => {
    isTouchSwiping = false;
  });

  // ===========================
  // DRAG CON MOUSE (DESKTOP)
  // ===========================
  let mouseStartX = 0;
  let isDragging = false;
  const DRAG_THRESHOLD = 40; // px minimi per cambiare slide

  const onMouseDown = (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
    stopAutoplay();
  };

  const onMouseUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - mouseStartX;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) goPrev();
      else goNext();
      startAutoplay();
    } else {
      // trascinato poco → solo riavvio autoplay
      startAutoplay();
    }
  };

  const onMouseLeave = () => {
    isDragging = false;
  };

  track.addEventListener("mousedown", onMouseDown);
  track.addEventListener("mouseup", onMouseUp);
  track.addEventListener("mouseleave", onMouseLeave);

  // ===========================
  // FRECCE TASTIERA (MENTRE SEI SOPRA IL CAROSELLO)
  // ===========================
  const handleKeydown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      userNavigate(goNext);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      userNavigate(goPrev);
    }
  };

  carousel.addEventListener("mouseenter", () => {
    // quando il mouse è sopra il carosello → attivo tasti freccia
    window.addEventListener("keydown", handleKeydown);
    stopAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    window.removeEventListener("keydown", handleKeydown);
    startAutoplay();
  });

  // Avvio iniziale
  updateSlide(0);
  startAutoplay();
})();

