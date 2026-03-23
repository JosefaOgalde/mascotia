const NAVBAR_TEMPLATE = `
  <header class="topbar">
    <div class="container topbar-inner">
      <a href="/" class="logo">mascotia.app</a>
    </div>
  </header>
`;

const FOOTER_TEMPLATE = `
  <footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-col">
        <h4>mascotia.app</h4>
        <p>Chile</p>
      </div>
      <div class="footer-col">
        <h5>Contacto</h5>
        <p><i class="fa-regular fa-envelope"></i> josefa@mascotia.app</p>
      </div>
    </div>

    <div class="container footer-bottom">
      <span>© <span id="year"></span> Mascotia.app. Todos los derechos reservados.</span>
    </div>
  </footer>
`;

const HERO_BANNERS = [
  "assets/banner_principal_1.jpeg",
  "assets/banner_principal_2.png",
  "assets/banner_principal_3.png",
];

const HERO_ROTATION_MS = 5000;
const QUICK_CAROUSEL_MS = 3500;
const QUICK_VISIBLE_COUNT = 4;
const QUICK_CAROUSEL_ITEMS = [
  {
    postUrl: "https://www.instagram.com/p/DWCfHwFFmx8/?img_index=1",
    imageUrl: "/assets/adopcion_1.png",
  },
  {
    postUrl: "https://www.instagram.com/p/DVR5xGpAQ0m/?img_index=1",
    imageUrl: "/assets/adopcion_2.png",
  },
  {
    postUrl: "https://www.instagram.com/p/DVhSb9lj-hP/?img_index=1",
    imageUrl: "/assets/adopcion_3.png",
  },
  {
    postUrl: "https://www.instagram.com/p/DT6Vbv1Dw8H/?img_index=2",
    imageUrl: "/assets/adopcion_4.png",
  },
  {
    postUrl: "https://www.instagram.com/p/DVoawYQDlJa/?img_index=6",
    imageUrl: "/assets/adopcion_5.png",
  },
  {
    postUrl: "https://www.instagram.com/p/DVoYMjLAMgu/?img_index=2",
    imageUrl: "/assets/adopcion_6.png",
  },
  {
    postUrl: "https://www.instagram.com/p/DWAeGEqDl2D/?img_index=1",
    imageUrl: "/assets/adopcion_7.png",
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
  const uniqueBanners = [...new Set(availableBanners)];
  const sourceBanners = uniqueBanners.length ? uniqueBanners : [fallbackBanner];

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
              <span class="quick-carousel-cta">¿Quieres adoptarme?</span>
              <img
                src="${item.imageUrl}"
                alt="Mascota en adopcion ${index + 1}"
                loading="lazy"
                onerror="if(this.dataset.fallbackTried){this.onerror=null;this.src='/assets/banner_principal_1.jpeg';}else{this.dataset.fallbackTried='1';this.src=this.src.replace('/assets/','/static/assets/');}"
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

async function parseJsonResponse(response) {
  const rawText = await response.text();
  if (!rawText) {
    return {};
  }
  try {
    return JSON.parse(rawText);
  } catch (_error) {
    return {};
  }
}

function setupFeedbackModal() {
  const modal = document.createElement("div");
  modal.className = "news-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="news-modal__backdrop" data-feedback-modal-close></div>
    <section
      class="news-modal__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <h3 id="feedback-modal-title"></h3>
      <div class="news-modal__actions">
        <button type="button" class="btn btn-fill" data-feedback-modal-close>Aceptar</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  const closeButtons = [...modal.querySelectorAll("[data-feedback-modal-close]")];
  const titleNode = modal.querySelector("#feedback-modal-title");

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function openModal(titleText) {
    if (titleNode) {
      titleNode.textContent = titleText;
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  return openModal;
}

const openFeedbackModal = setupFeedbackModal();

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
  const heroBanner = document.querySelector("[data-hero-open-newsletter]");

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

  if (heroBanner) {
    heroBanner.addEventListener("click", (event) => {
      if (event.target.closest(".hero-arrow, .hero-indicator-dot")) {
        return;
      }
      openModal();
    });
  }

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
    const website = String(formData.get("website") || "").trim();

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
        body: JSON.stringify({ email, website }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok || !data.ok) {
        if (data.already_exists) {
          setMessage("", false);
          closeModal();
          openFeedbackModal("Cuenta ya registrada");
          return;
        }

        const fallbackMessage = response.status === 404
          ? "El servicio de suscripcion no esta disponible en este momento."
          : "No fue posible completar la suscripcion.";
        setMessage(data.message || fallbackMessage, false);
        return;
      }

      setMessage("", true);
      closeModal();
      openFeedbackModal("Te suscribimos");
      window.scrollTo({ top: 0, behavior: "smooth" });
      form.reset();
    } catch (_error) {
      setMessage("Error de conexion. Intenta nuevamente.", false);
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

    if (!["busco_adoptar", "quiero_dar_en_adopcion", "otro"].includes(payload.request_type)) {
      setMessage("Selecciona una opcion valida.", false);
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

      const data = await parseJsonResponse(response);

      if (!response.ok || !data.ok) {
        const fallbackMessage = response.status === 404
          ? "El servicio del formulario no esta disponible en este momento."
          : "No fue posible enviar el formulario.";
        setMessage(data.message || fallbackMessage, false);
        return;
      }

      setMessage("", true);
      openFeedbackModal("Ya se envio el formulario");
      form.reset();
    } catch (_error) {
      setMessage("Error de conexion. Intenta nuevamente.", false);
    }
  });
}

setupAdoptionForm();

function setupNewsLinks() {
  const modal = document.createElement("div");
  modal.className = "news-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="news-modal__backdrop" data-news-modal-close></div>
    <section class="news-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="news-modal-title">
      <h3 id="news-modal-title">¿Deseas visitar el sitio de la noticia?</h3>
      <div class="news-modal__actions">
        <button type="button" class="btn btn-outline" data-news-modal-close>No, quedarme aqui</button>
        <button type="button" class="btn btn-fill" data-news-modal-confirm>Si, visitar sitio</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  const closeButtons = [...modal.querySelectorAll("[data-news-modal-close]")];
  const confirmButton = modal.querySelector("[data-news-modal-confirm]");
  let pendingUrl = "";

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    pendingUrl = "";
  }

  function openModal(url) {
    pendingUrl = url;
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      if (pendingUrl) {
        window.open(pendingUrl, "_blank", "noopener,noreferrer");
      }
      closeModal();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  document.querySelectorAll(".news-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Abrir noticia");
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".news-go-btn, .news-card");
    if (!trigger) {
      return;
    }

    const card = trigger.closest(".news-card");
    if (!card) {
      return;
    }

    const button = card.querySelector(".news-go-btn");
    const newsUrl = trigger.getAttribute("data-news-url") || button?.getAttribute("data-news-url");
    if (!newsUrl) {
      return;
    }

    event.preventDefault();
    openModal(newsUrl);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest(".news-card");
    if (!card) {
      return;
    }

    const button = card.querySelector(".news-go-btn");
    const newsUrl = button?.getAttribute("data-news-url");
    if (!newsUrl) {
      return;
    }

    event.preventDefault();
    openModal(newsUrl);
  });
}

setupNewsLinks();

const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

