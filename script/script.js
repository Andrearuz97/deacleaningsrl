// ===========================
// NAVBAR MOBILE TOGGLE
// ===========================
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const htmlEl = document.documentElement; // ⬅️ aggiunto

if (navToggle && navLinks) {
  const toggleIcon = navToggle.querySelector("i");

  const lockBodyScroll = () => {
    // blocco scroll su HTML + BODY
    htmlEl.classList.add("nav-open");
    document.body.classList.add("nav-open");
  };

  const unlockBodyScroll = () => {
    htmlEl.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
  };

  const closeMenu = () => {
    navLinks.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    unlockBodyScroll();
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

    if (isOpen) {
      lockBodyScroll();   // blocco scroll, ma NON tocco posizione/scrollTo
    } else {
      unlockBodyScroll(); // sblocco, nessun salto
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
      const isMenuOpen = navLinks.classList.contains("show");
      if (isMenuOpen) {
        closeMenu();
      }
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
// LINK NAVBAR ATTIVO (versione con scroll, più precisa)
// ===========================
const sections = document.querySelectorAll("section[id]");
const navLinksAnchors = document.querySelectorAll(".nav-links a[href^='#']");

if (sections.length && navLinksAnchors.length) {
  const HEADER_OFFSET = 90; // altezza header + margine di sicurezza

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + HEADER_OFFSET;
    let currentId = null;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.id;
      }
    });

    if (!currentId) return;

    navLinksAnchors.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  // Aggiorna al load e allo scroll
  window.addEventListener("scroll", updateActiveNav);
  window.addEventListener("load", updateActiveNav);
  updateActiveNav();
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
  const originalSlides = Array.from(
    carousel.querySelectorAll(".review-card")
  );
  const prevBtn = carousel.querySelector(".reviews-prev");
  const nextBtn = carousel.querySelector(".reviews-next");
  const dotsContainer = carousel.querySelector(".reviews-dots");

  if (!track || originalSlides.length === 0) return;

  const slideCount = originalSlides.length;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000; // 6 secondi
  let isAnimating = false;     // ⬅️ blocco durante animazione

  // ===========================
  // CLONI PER EFFETTO INFINITO
  // ===========================
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[slideCount - 1].cloneNode(true);

  // Struttura finale nel DOM:
  // [ lastClone, slide0, slide1, ..., slideN-1, firstClone ]
  track.insertBefore(lastClone, originalSlides[0]);
  track.appendChild(firstClone);

  const allSlides = Array.from(track.querySelectorAll(".review-card"));

  // 0 = lastClone, 1 = slide reale 0, 2 = slide reale 1, ..., slideCount = slide reale N-1, slideCount+1 = firstClone
  let currentIndex = 1; // partiamo dalla PRIMA slide reale

  // ===========================
  // PALLINI (uno per ogni slide reale)
  // ===========================
  if (dotsContainer) {
    originalSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "reviews-dot";
      dot.dataset.index = String(index);
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer
    ? Array.from(dotsContainer.querySelectorAll(".reviews-dot"))
    : [];

  // Aggiorna posizione carosello + pallini
  function setPosition(animated = true) {
    if (!animated) {
      track.style.transition = "none";
    }

    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    if (!animated) {
      void track.offsetWidth;  // forza reflow
      track.style.transition = "";
    }

    const realIndex = ((currentIndex - 1 + slideCount) % slideCount);

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === realIndex);
    });
  }

  function goNext() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex += 1;
    setPosition(true);
  }

  function goPrev() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex -= 1;
    setPosition(true);
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
    startAutoplay();
  }

  // ===========================
  // GESTIONE "FINE / INIZIO" (WRAP)
  // ===========================
  track.addEventListener("transitionend", () => {
    if (currentIndex === slideCount + 1) {
      currentIndex = 1;
      setPosition(false);
    }

    if (currentIndex === 0) {
      currentIndex = slideCount;
      setPosition(false);
    }

    isAnimating = false; // ⬅️ sblocca alla fine dell’animazione
  });

  // ===========================
  // Eventi frecce (bottoni)
  // ===========================
  if (nextBtn) {
    nextBtn.addEventListener("click", () => userNavigate(goNext));
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => userNavigate(goPrev));
  }

  // ===========================
  // Eventi pallini
  // ===========================
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;
      const realIndex = Number(dot.dataset.index || "0");
      currentIndex = realIndex + 1; // +1 perché 0 è il clone dell'ultima
      setPosition(true);
      startAutoplay();
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

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      e.preventDefault();

      if (dx < 0) {
        userNavigate(goNext);
      } else {
        userNavigate(goPrev);
      }

      isTouchSwiping = false;
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
  const DRAG_THRESHOLD = 40;

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
    window.addEventListener("keydown", handleKeydown);
    stopAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    window.removeEventListener("keydown", handleKeydown);
    startAutoplay();
  });

  // Avvio iniziale
  setPosition(false); // vai alla prima reale senza animazione
  startAutoplay();
})();
// ===========================
// FEEDBACK VISIVO CLICK (TUTTO) - VERSIONE "BLINDATA"
// ===========================
function attachPressedFeedback(selector) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  elements.forEach((el) => {
    let pressedTimeout = null;
    let lastTouchTime = 0;          // per distinguere tap da click "finto" dopo il touch
    const TOUCH_DELAY = 600;        // ms

    const addPressed = () => {
      el.classList.add("is-pressed");

      // sicurezza: la rimuovo comunque dopo un po'
      if (pressedTimeout) clearTimeout(pressedTimeout);
      pressedTimeout = setTimeout(() => {
        el.classList.remove("is-pressed");
      }, 250);
    };

    const removePressed = () => {
      if (pressedTimeout) clearTimeout(pressedTimeout);
      el.classList.remove("is-pressed");
    };

    // TOUCH (Android / iOS reali)
    el.addEventListener(
      "touchstart",
      () => {
        lastTouchTime = Date.now();
        addPressed();
      },
      { passive: true }
    );

    el.addEventListener("touchend", removePressed);
    el.addEventListener("touchcancel", removePressed);

    // MOUSE (desktop / eventuale mouse su tablet)
    el.addEventListener("mousedown", () => {
      addPressed();
    });

    el.addEventListener("mouseup", removePressed);
    el.addEventListener("mouseleave", removePressed);
    el.addEventListener("blur", removePressed);

    // CLICK DI RISERVA:
    // se per qualche motivo touchstart/mousedown non partono,
    // almeno il click attiva l'effetto.
    el.addEventListener("click", () => {
      const now = Date.now();

      // se il click arriva subito dopo un touch, è il "finto" click di Android:
      // in quel caso lo ignoriamo per evitare doppio effetto.
      if (now - lastTouchTime < TOUCH_DELAY) return;

      addPressed();
      setTimeout(removePressed, 200);
    });
  });
}

// Applico l'effetto "pressed" a TUTTI i click importanti
attachPressedFeedback(
  ".footer-social-icons a, " +
    "#back-to-top, " +
    ".btn, " +                 // tutti i bottoni (Richiedi preventivo, Invia richiesta, cookie ecc.)
    ".nav-links a, " +         // link della navbar
    ".whatsapp-float, " +      // bottone WhatsApp flottante
    ".reviews-arrow, " +       // frecce del carosello
    ".reviews-dot"             // pallini del carosello
);

// Effetto anche su link contatti e link legali nel footer
attachPressedFeedback(".contact-list a, .footer-legal a");



