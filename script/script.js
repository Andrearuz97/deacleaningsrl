// Navbar mobile toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Chiudi il menu quando clicchi su un link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}

// Anno nel footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Gestione form contatti (solo frontend)
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const servizio = document.getElementById("servizio").value;
    const messaggio = document.getElementById("messaggio").value.trim();

    if (!nome || !email || !telefono || !servizio || !messaggio) {
      formMessage.textContent = "Compila tutti i campi per inviare la richiesta.";
      formMessage.classList.remove("success");
      formMessage.classList.add("error");
      return;
    }

    // Qui potresti integrare un backend / servizio email
    // Per ora simuliamo semplicemente l'invio
    formMessage.textContent = "Richiesta inviata con successo! Ti ricontatteremo al più presto.";
    formMessage.classList.remove("error");
    formMessage.classList.add("success");

    contactForm.reset();
  });
}
// Scroll morbido con offset per la navbar sticky
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      e.preventDefault();

      const header = document.querySelector(".header");
      const headerHeight = header ? header.offsetHeight : 0;

      const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 1; // -10 per un filo di aria

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

