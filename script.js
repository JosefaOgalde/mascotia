const NAVBAR_TEMPLATE = `
  <header class="topbar">
    <div class="container topbar-inner">
      <a href="#" class="logo">mascotia.app</a>
    </div>
  </header>
`;

const FOOTER_TEMPLATE = `
  <footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-col">
        <h4>mascotia.app</h4>
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
        <a href="https://instagram.com/mascotia.app" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <i class="fa-brands fa-instagram"></i>
        </a>
      </div>
    </div>
  </footer>
`;

const HERO_BANNERS = [
  "assets/banner_principal_1.jpeg",
  "assets/banner_principal_2.png",
  "assets/banner_principal_3.png",
  "assets/banner_principal_1.png",
];

const HERO_ROTATION_MS = 15000;
const QUICK_CAROUSEL_MS = 3500;
const QUICK_VISIBLE_COUNT = 4;
const QUICK_CAROUSEL_ITEMS = [
  {
    postUrl: "https://www.instagram.com/p/DVoawYQDlJa/?img_index=6",
    imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DVhSb9lj-hP/?img_index=1",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DWCfHwFFmx8/?img_index=1",
    imageUrl: "https://images.unsplash.com/photo-1560743641-3914f2c45636?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DVoYMjLAMgu/?img_index=1",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DT6Vbv1Dw8H/?img_index=2",
    imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DVWS6VUEb0H/",
    imageUrl: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DVR5xGpAQ0m/?img_index=1",
    imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    postUrl: "https://www.instagram.com/p/DWAeGEqDl2D/?img_index=1",
    imageUrl: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=1200&q=80",
  },
];

function injectGlobalLayout() {
  const navbarSlot = document.querySelector("[data-global-navbar]");
  const footerSlot = document.querySelector("[data-global-footer]");

  if (navbarSlot) {
    navbarSlot.innerHTML = NAVBAR_TEMPLATE;
    const legacyAuthButtons = navbarSlot.querySelector(".auth-buttons");
    if (legacyAuthButtons) {
      legacyAuthButtons.remove();
    }
  }

  if (footerSlot) {
    footerSlot.innerHTML = FOOTER_TEMPLATE;
  }
}

injectGlobalLayout();

function setupHeroCarousel() {
  const slidesContainer = document.querySelector("[data-hero-slides]");
  const prevButton = document.querySelector("[data-hero-prev]");
  const nextButton = document.querySelector("[data-hero-next]");
  const indicatorsContainer = document.querySelector("[data-hero-indicators]");

  if (!slidesContainer) {
    return;
  }

  const availableBanners = HERO_BANNERS.filter(Boolean);
  const fallbackBanner = "assets/banner_principal_1.jpeg";
  const sourceBanners = availableBanners.length ? availableBanners : [fallbackBanner];

  if (sourceBanners.length === 1) {
    slidesContainer.innerHTML = `
      <figure class="hero-slide">
        <img src="${sourceBanners[0]}" alt="Banner principal Mascotia" loading="lazy" />
      </figure>
    `;
    return;
  }

  const extendedBanners = [
    sourceBanners[sourceBanners.length - 1],
    ...sourceBanners,
    sourceBanners[0],
  ];

  slidesContainer.innerHTML = `
    <div class="hero-track">
      ${extendedBanners
        .map(
          (source) => `
            <figure class="hero-slide">
              <img src="${source}" alt="Banner principal Mascotia" loading="lazy" />
            </figure>
          `
        )
        .join("")}
    </div>
  `;

  const track = slidesContainer.querySelector(".hero-track");
  if (!track) {
    return;
  }

  let currentIndex = 1;
  const transitionMs = 800;
  let autoplayTimer = null;
  let indicatorDots = [];

  function moveToCurrent(animate) {
    track.style.transition = animate ? `transform ${transitionMs}ms ease` : "none";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();
  }

  function getLogicalIndex() {
    return ((currentIndex - 1) % sourceBanners.length + sourceBanners.length) % sourceBanners.length;
  }

  function updateIndicators() {
    const logicalIndex = getLogicalIndex();
    indicatorDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === logicalIndex);
    });
  }

  function createIndicators() {
    if (!indicatorsContainer) {
      return;
    }

    indicatorsContainer.innerHTML = sourceBanners
      .map(
        (_, index) => `
          <button
            type="button"
            class="hero-indicator-dot${index === 0 ? " is-active" : ""}"
            data-hero-dot="${index}"
            aria-label="Ir al banner ${index + 1}"
          ></button>
        `
      )
      .join("");

    indicatorDots = [...indicatorsContainer.querySelectorAll(".hero-indicator-dot")];

    indicatorDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetIndex = Number(dot.getAttribute("data-hero-dot"));
        if (Number.isNaN(targetIndex)) {
          return;
        }
        currentIndex = targetIndex + 1;
        moveToCurrent(true);
        restartAutoplay();
      });
    });
  }

  createIndicators();
  moveToCurrent(false);

  track.addEventListener("transitionend", () => {
    if (currentIndex === extendedBanners.length - 1) {
      currentIndex = 1;
      moveToCurrent(false);
    } else if (currentIndex === 0) {
      currentIndex = extendedBanners.length - 2;
      moveToCurrent(false);
    }
  });

  function moveNext() {
    currentIndex += 1;
    moveToCurrent(true);
  }

  function movePrev() {
    currentIndex -= 1;
    moveToCurrent(true);
  }

  function restartAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
    }
    autoplayTimer = window.setInterval(moveNext, HERO_ROTATION_MS);
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      moveNext();
      restartAutoplay();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      movePrev();
      restartAutoplay();
    });
  }

  restartAutoplay();
}

setupHeroCarousel();

function setupQuickCarousel() {
  const carousel = document.querySelector("[data-quick-carousel]");

  if (!carousel) {
    return;
  }

  const items = QUICK_CAROUSEL_ITEMS.filter((item) => item && item.postUrl && item.imageUrl);

  if (!items.length) {
    return;
  }

  let current = 0;

  function getVisibleItems(start, count) {
    return Array.from({ length: count }, (_, offset) => items[(start + offset) % items.length]);
  }

  function renderVisible() {
    const visible = getVisibleItems(current, QUICK_VISIBLE_COUNT);
    carousel.innerHTML = visible
      .map(
        (item, index) => `
          <article class="quick-carousel-card">
            <a
              href="${item.postUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="quick-carousel-link"
              aria-label="Abrir publicacion de Instagram ${index + 1}"
            >
              <span class="quick-carousel-cta">Quieres adoptarme</span>
              <img
                src="${item.imageUrl}"
                alt="Mascota en adopcion ${index + 1}"
                loading="lazy"
                onerror="this.onerror=null;this.src='assets/banner_principal_1.jpeg';"
              />
            </a>
          </article>
        `
      )
      .join("");
  }

  renderVisible();

  if (items.length <= 1) {
    return;
  }

  window.setInterval(() => {
    current = (current + 1) % items.length;
    renderVisible();
  }, QUICK_CAROUSEL_MS);
}

setupQuickCarousel();

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

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-newsletter]");
    if (trigger) {
      event.preventDefault();
      openModal();
    }
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
        const mailtoLink = `mailto:josefa@mascotia.app?subject=Suscripcion%20newsletter&body=Hola,%20quiero%20suscribirme%20con%20el%20correo:%20${encodeURIComponent(email)}`;
        window.location.href = mailtoLink;
        setMessage("Te redirigimos al correo para completar la suscripcion.", true);
      } else {
        setMessage(data.message || "Suscripcion realizada con exito.", true);
      }
      form.reset();
    } catch (_error) {
      const mailtoLink = `mailto:josefa@mascotia.app?subject=Suscripcion%20newsletter&body=Hola,%20quiero%20suscribirme%20con%20el%20correo:%20${encodeURIComponent(email)}`;
      window.location.href = mailtoLink;
      setMessage("Te redirigimos al correo para completar la suscripcion.", true);
      form.reset();
    }
  });
}

setupNewsletterModal();

function setupAdoptionForm() {
  const form = document.querySelector("[data-adoption-form]");
  const message = document.querySelector("[data-adoption-message]");

  if (!form || !message) {
    return;
  }

  function setMessage(text, success) {
    message.textContent = text;
    message.classList.toggle("is-success", success);
    message.classList.toggle("is-error", !success);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.request_type || !payload.full_name || !payload.email || !payload.details) {
      setMessage("Completa los campos obligatorios.", false);
      return;
    }

    setMessage("Enviando formulario...", true);

    try {
      const csrfToken = getCookie("csrftoken");
      const response = await fetch("/api/adoption/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || "No fue posible enviar el formulario.", false);
        return;
      }

      setMessage(data.message || "Formulario enviado correctamente.", true);
      form.reset();
    } catch (_error) {
      setMessage("Error de conexion. Intenta nuevamente.", false);
    }
  });
}

setupAdoptionForm();

function setupNewsLinks() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".news-go-btn");
    if (!button) {
      return;
    }

    const newsUrl = button.getAttribute("data-news-url");
    if (!newsUrl) {
      return;
    }

    const shouldOpen = window.confirm("Quieres ir al sitio de esta noticia?");
    if (shouldOpen) {
      window.open(newsUrl, "_blank", "noopener,noreferrer");
    }
  });
}

setupNewsLinks();

const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});
