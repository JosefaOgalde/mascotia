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
        <a href="mailto:josefa@mascotia.app" class="footer-contact-link">
          <svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.1-.5L12 10.8 19.9 5H4.1Zm15.9 2.1-7.4 5.4a1 1 0 0 1-1.2 0L4 7.1v11.4a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V7.1Z"
            />
          </svg>
          josefa@mascotia.app
        </a>
        <a
          href="https://www.instagram.com/mascotia.app"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-contact-link"
        >
          <svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
            />
          </svg>
          @mascotia.app
        </a>
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
  "assets/banner_principal_4.png",
];

const HERO_ROTATION_MS = 5000;
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

  const availableBanners = HERO_BANNERS.filter((bannerPath) => typeof bannerPath === "string" && bannerPath.trim());
  const fallbackBanner = "assets/banner_principal_1.jpeg";
  const sourceBanners = availableBanners.length ? availableBanners : [fallbackBanner];

  function heroImageOnErrorHandler() {
    return "if(this.dataset.fallbackStage==='1'){this.onerror=null;this.src='/static/assets/banner_principal_1.jpeg';return;}this.dataset.fallbackStage='1';const currentSrc=this.getAttribute('src')||'';if(currentSrc.startsWith('assets/')){this.src='/' + currentSrc;return;}if(currentSrc.startsWith('/assets/')){this.src=currentSrc.replace('/assets/','/static/assets/');return;}this.src='/assets/banner_principal_1.jpeg';";
  }

  if (sourceBanners.length === 1) {
    slidesContainer.innerHTML = `
      <figure class="hero-slide">
        <img
          src="${sourceBanners[0]}"
          alt="Banner principal Mascotia"
          loading="lazy"
          decoding="async"
          onerror="${heroImageOnErrorHandler()}"
        />
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
              <img
                src="${source}"
                alt="Banner principal Mascotia"
                loading="lazy"
                decoding="async"
                onerror="${heroImageOnErrorHandler()}"
              />
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
  let isTransitioning = false;

  function moveToCurrent(animate) {
    const maxIndex = extendedBanners.length - 1;
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    isTransitioning = animate;
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

  function normalizeAfterTransition() {
    isTransitioning = false;
    if (currentIndex >= extendedBanners.length - 1) {
      currentIndex = 1;
      moveToCurrent(false);
    } else if (currentIndex <= 0) {
      currentIndex = extendedBanners.length - 2;
      moveToCurrent(false);
    }
  }

  track.addEventListener("transitionend", normalizeAfterTransition);
  track.addEventListener("transitioncancel", normalizeAfterTransition);

  function moveNext() {
    if (isTransitioning) {
      return;
    }
    currentIndex += 1;
    moveToCurrent(true);
  }

  function movePrev() {
    if (isTransitioning) {
      return;
    }
    currentIndex -= 1;
    moveToCurrent(true);
  }

  function restartAutoplay() {
    if (autoplayTimer) {
      window.clearTimeout(autoplayTimer);
    }
    autoplayTimer = window.setTimeout(() => {
      moveNext();
      restartAutoplay();
    }, HERO_ROTATION_MS);
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

  const renderCards = (itemList) => itemList
    .map(
      (item, index) => `
        <article class="quick-carousel-card">
          <a
            href="${item.postUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="quick-carousel-link"
            aria-label="Abrir publicación de Instagram ${index + 1}"
          >
            <span class="quick-carousel-cta">¿Quieres adoptarme?</span>
            <img
              src="${item.imageUrl}"
              alt="Mascota en adopción ${index + 1}"
              loading="lazy"
              onerror="if(this.dataset.fallbackTried){this.onerror=null;this.src='/assets/banner_principal_1.jpeg';}else{this.dataset.fallbackTried='1';this.src=this.src.replace('/assets/','/static/assets/');}"
            />
          </a>
        </article>
      `
    )
    .join("");

  carousel.innerHTML = `
    <div class="quick-carousel-track">
      <div class="quick-carousel-set">
        ${renderCards(items)}
      </div>
      <div class="quick-carousel-set" aria-hidden="true">
        ${renderCards(items)}
      </div>
    </div>
  `;

  const track = carousel.querySelector(".quick-carousel-track");
  const firstSet = carousel.querySelector(".quick-carousel-set");

  if (!track || !firstSet) {
    return;
  }

  function updateScrollDistance() {
    const setWidth = firstSet.getBoundingClientRect().width;
    const trackStyles = window.getComputedStyle(track);
    const rawGap = trackStyles.columnGap || trackStyles.gap || "0";
    const parsedGap = Number.parseFloat(rawGap);
    const trackGap = Number.isFinite(parsedGap) ? parsedGap : 0;
    track.style.setProperty("--scroll-distance", `${setWidth + trackGap}px`);
  }

  updateScrollDistance();
  window.addEventListener("resize", updateScrollDistance);
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

function getCsrfTokenFromDom() {
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
  if (metaToken) {
    return metaToken;
  }

  const inputToken = document.querySelector("input[name='csrfmiddlewaretoken']")?.value;
  return inputToken || "";
}

async function ensureCsrfToken() {
  const domToken = getCsrfTokenFromDom();
  if (domToken) {
    return domToken;
  }

  const existingToken = getCookie("csrftoken");
  if (existingToken) {
    return existingToken;
  }

  try {
    const response = await fetch("/api/csrf/", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) {
      return getCsrfTokenFromDom() || getCookie("csrftoken");
    }
    const data = await parseJsonResponse(response);
    if (data.csrfToken) {
      return data.csrfToken;
    }
  } catch (_error) {
    // The POST handler will show a friendly fallback message.
  }

  return getCsrfTokenFromDom() || getCookie("csrftoken");
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

function setupSuccessToast() {
  const toast = document.createElement("div");
  toast.className = "site-toast";
  toast.setAttribute("aria-live", "polite");
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);

  let timeoutId = null;

  return function showToast(text) {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    toast.textContent = text;
    toast.classList.add("is-visible");
    timeoutId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 4500);
  };
}

const showSuccessToast = setupSuccessToast();

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
      setMessage("Ingresa un correo válido.", false);
      return;
    }

    setMessage("Procesando suscripción...", true);

    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        setMessage("No pudimos validar tu sesión. Recarga la página e intenta nuevamente.", false);
        return;
      }

      const payload = new URLSearchParams();
      payload.set("email", email);
      payload.set("website", website);

      const response = await fetch("/api/newsletter/subscribe/", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRFToken": csrfToken,
        },
        body: payload.toString(),
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
          ? "El servicio de suscripción no está disponible en este momento."
          : "No fue posible completar la suscripción.";
        setMessage(data.message || fallbackMessage, false);
        return;
      }

      setMessage("", true);
      closeModal();
      openFeedbackModal("Te suscribimos");
      window.scrollTo({ top: 0, behavior: "smooth" });
      form.reset();
    } catch (_error) {
      setMessage("Error de conexión. Intenta nuevamente.", false);
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
      setMessage("Selecciona una opción válida.", false);
      return;
    }

    setMessage("Enviando formulario...", true);

    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        setMessage("No pudimos validar tu sesión. Recarga la página e intenta nuevamente.", false);
        return;
      }

      const response = await fetch("/api/adoption/submit/", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok || !data.ok) {
        const fallbackMessage = response.status === 404
          ? "El servicio del formulario no está disponible en este momento."
          : "No fue posible enviar el formulario.";
        setMessage(data.message || fallbackMessage, false);
        return;
      }

      setMessage("", true);
      showSuccessToast("El formulario quedó registrado, pronto te contactarán.");
      form.reset();
    } catch (_error) {
      setMessage("Error de conexión. Intenta nuevamente.", false);
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
        <button type="button" class="btn btn-outline" data-news-modal-close>No, quedarme aquí</button>
        <button type="button" class="btn btn-fill" data-news-modal-confirm>Sí, visitar sitio</button>
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

