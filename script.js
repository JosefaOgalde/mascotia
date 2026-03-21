const NAVBAR_TEMPLATE = `
  <header class="topbar">
    <div class="container topbar-inner">
      <a href="#" class="logo">mascotia.app</a>
      <nav class="auth-buttons">
        <button class="btn btn-fill" data-open-newsletter>Suscribete a nuestro newsletter</button>
      </nav>
    </div>
  </header>
`;

const FOOTER_TEMPLATE = `
  <footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-col">
        <h4>mascotia.app</h4>
        <p>Bitácora Digital de Salud Animal para Tutores.</p>
        <p>Centraliza el historial clínico de tus mascotas.</p>
      </div>
      <div class="footer-col">
        <h5>Enlaces rápidos</h5>
        <a href="#">Inicio</a>
        <a href="#">Sobre Nosotros</a>
        <a href="#">Servicios</a>
        <a href="#">Preguntas Frecuentes</a>
      </div>
      <div class="footer-col">
        <h5>Soporte</h5>
        <a href="#">Centro de Ayuda</a>
        <a href="#">Términos y Condiciones</a>
        <a href="#">Política de Privacidad</a>
        <a href="#">Contacto</a>
      </div>
      <div class="footer-col">
        <h5>Contacto</h5>
        <p><i class="fa-regular fa-envelope"></i> josefa@mascotia.app</p>
        <p><i class="fa-solid fa-earth-americas"></i> Chile</p>
      </div>
    </div>

    <div class="container footer-bottom">
      <span>© <span id="year"></span> Mascotia.app. Todos los derechos reservados.</span>
      <div class="socials">
        <a href="mailto:josefa@mascotia.app" aria-label="Correo"><i class="fa-regular fa-envelope"></i></a>
        <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
  </footer>
`;

const HERO_BANNERS = [
  "assets/banner_principal_1.png",
  "assets/banner_principal_1.png",
];

const HERO_ROTATION_MS = 30000;

function injectGlobalLayout() {
  const navbarSlot = document.querySelector("[data-global-navbar]");
  const footerSlot = document.querySelector("[data-global-footer]");

  if (navbarSlot) {
    navbarSlot.innerHTML = NAVBAR_TEMPLATE;
  }

  if (footerSlot) {
    footerSlot.innerHTML = FOOTER_TEMPLATE;
  }
}

injectGlobalLayout();

function setupHeroCarousel() {
  const slidesContainer = document.querySelector("[data-hero-slides]");

  if (!slidesContainer) {
    return;
  }

  const availableBanners = HERO_BANNERS.filter(Boolean);
  const fallbackBanner = "assets/banner_principal_1.png";
  const sourceBanners = availableBanners.length ? availableBanners : [fallbackBanner];
  const normalizedBanners =
    sourceBanners.length >= 2 ? sourceBanners : [sourceBanners[0], sourceBanners[0]];

  slidesContainer.innerHTML = normalizedBanners
    .map(
      (source, index) => `
        <figure class="hero-slide${index === 0 ? " is-active" : ""}">
          <img src="${source}" alt="Banner principal Mascotia" loading="lazy" />
        </figure>
      `
    )
    .join("");

  const slides = [...slidesContainer.querySelectorAll(".hero-slide")];

  if (slides.length < 2) {
    return;
  }

  let activeIndex = 0;

  window.setInterval(() => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }, HERO_ROTATION_MS);
}

setupHeroCarousel();

function getCookie(name) {
  const allCookies = `; ${document.cookie}`;
  const cookieParts = allCookies.split(`; ${name}=`);
  if (cookieParts.length !== 2) {
    return "";
  }
  return cookieParts.pop().split(";").shift();
}

function setupNewsletterModal() {
  const modal = document.querySelector("[data-newsletter-modal]");
  const openButtons = [...document.querySelectorAll("[data-open-newsletter]")];
  const closeButtons = [...document.querySelectorAll("[data-close-newsletter]")];
  const form = document.querySelector("[data-newsletter-form]");
  const message = document.querySelector("[data-newsletter-message]");

  if (!modal || !openButtons.length || !form || !message) {
    return;
  }

  const emailInput = form.querySelector("input[name='email']");

  function openModal() {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (emailInput) {
      emailInput.focus();
    }
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function setMessage(text, success) {
    message.textContent = text;
    message.classList.toggle("is-success", success);
    message.classList.toggle("is-error", !success);
  }

  openButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      setMessage("Ingresa un correo valido.", false);
      return;
    }

    setMessage("Procesando suscripcion...", true);

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch("/api/newsletter/subscribe/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || "No pudimos procesar la suscripcion.", false);
        return;
      }

      setMessage(data.message || "Suscripcion realizada con exito.", true);
      form.reset();
    } catch (_error) {
      setMessage("Error de conexion. Intenta nuevamente.", false);
    }
  });
}

setupNewsletterModal();

const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});
