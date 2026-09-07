const pageParams = new URLSearchParams(window.location.search);
const captureMode = pageParams.has("capture");
if (captureMode) document.documentElement.classList.add("capture-mode");
const captureSection = pageParams.get("section");
if (captureMode && captureSection) document.documentElement.classList.add(`capture-${captureSection}`);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const progress = document.querySelector(".page-progress span");
const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

const setScrollState = () => {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 24);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
  progress?.style.setProperty("transform", `scaleX(${ratio})`);
};

setScrollState();
window.addEventListener("scroll", setScrollState, { passive: true });

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Abrir menú");
  nav?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
  nav?.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealItems = document.querySelectorAll(".reveal");
if (captureMode || reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7%" },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const hero = document.querySelector("[data-hero]");
const heroMedia = document.querySelector("[data-hero-media]");
if (hero && heroMedia && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroMedia.style.setProperty("--mx", x.toFixed(3));
    heroMedia.style.setProperty("--my", y.toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    heroMedia.style.setProperty("--mx", 0);
    heroMedia.style.setProperty("--my", 0);
  });
}

const particleCanvas = document.querySelector("[data-hero-particles]");
if (particleCanvas && !reducedMotion && !captureMode) {
  const context = particleCanvas.getContext("2d");
  const colors = ["41,184,255", "130,72,255", "255,58,167", "255,146,30"];
  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;
  let isVisible = true;

  const resetParticle = (particle, initial = false) => {
    particle.x = Math.random() * width;
    particle.y = initial ? Math.random() * height : height + 12;
    particle.radius = Math.random() * 1.45 + .35;
    particle.speed = Math.random() * .28 + .12;
    particle.drift = (Math.random() - .5) * .2;
    particle.alpha = Math.random() * .55 + .18;
    particle.color = colors[Math.floor(Math.random() * colors.length)];
  };

  const resizeParticles = () => {
    const rect = particleCanvas.getBoundingClientRect();
    const density = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    particleCanvas.width = Math.round(width * density);
    particleCanvas.height = Math.round(height * density);
    context.setTransform(density, 0, 0, density, 0, 0);
    const count = Math.max(28, Math.round(width / 13));
    particles = Array.from({ length: count }, () => {
      const particle = {};
      resetParticle(particle, true);
      return particle;
    });
  };

  const drawParticles = () => {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;
      if (particle.y < -12 || particle.x < -20 || particle.x > width + 20) resetParticle(particle);

      const glow = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 5,
      );
      glow.addColorStop(0, `rgba(${particle.color},${particle.alpha})`);
      glow.addColorStop(1, `rgba(${particle.color},0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
      context.fill();
    });
    if (isVisible && !document.hidden) animationFrame = requestAnimationFrame(drawParticles);
  };

  new ResizeObserver(resizeParticles).observe(particleCanvas);
  new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    cancelAnimationFrame(animationFrame);
    if (isVisible) animationFrame = requestAnimationFrame(drawParticles);
  }).observe(particleCanvas);
}

document.querySelectorAll("[data-spotlight]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  });
});

const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const phone = form.dataset.whatsapp?.replace(/\D/g, "");
  const nombre = String(data.get("nombre") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const servicio = String(data.get("servicio") ?? "").trim();
  const mensaje = String(data.get("mensaje") ?? "").trim();

  const texto = [
    `Hola Sala Cero, soy ${nombre}.`,
    `Necesito: ${servicio}.`,
    "",
    mensaje,
    email ? `\nMi correo: ${email}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (phone) {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    if (formStatus) formStatus.textContent = "Abrimos WhatsApp con tu consulta lista. Solo falta que la envies.";
    return;
  }

  const recipient = form.dataset.recipient?.trim();
  if (recipient) {
    const subject = `Nuevo proyecto: ${servicio}`;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(texto)}`;
    if (formStatus) formStatus.textContent = "Abriendo tu aplicacion de correo...";
  }
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

/* Precios: un carrusel horizontal por cada fila de categoría */
document.querySelectorAll(".price-row").forEach((row) => {
  const track = row.querySelector("[data-price-track]");
  const prev = row.querySelector("[data-price-prev]");
  const next = row.querySelector("[data-price-next]");
  if (!track || !prev || !next) return;

  const syncArrows = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  const slide = (direction) => {
    const card = track.querySelector(".price-card");
    const gap = parseFloat(getComputedStyle(track).columnGap || "16") || 16;
    const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  prev.addEventListener("click", () => slide(-1));
  next.addEventListener("click", () => slide(1));
  track.addEventListener("scroll", syncArrows, { passive: true });
  window.addEventListener("resize", syncArrows, { passive: true });
  syncArrows();
});

/* Ficha técnica: al tocar una tarjeta se abre con todos los datos del producto */
const pd = document.querySelector("[data-price-dialog]");

if (pd) {
  const campo = (sel) => pd.querySelector(sel);
  const grid = campo("[data-pd-grid]");

  const abrir = (card) => {
    const d = card.dataset;
    campo("[data-pd-title]").textContent = d.producto;
    campo("[data-pd-desc]").textContent = d.desc;
    campo("[data-pd-price]").textContent = d.precio;

    const conServidor = d.servidor && d.servidor !== "Bs 0";
    const filas = [["Entrega", d.entrega]];
    if (conServidor) filas.push(["Servidor al mes", d.servidor]);
    if (d.mantenimiento && d.mantenimiento !== "—") {
      filas.push(["Mantenimiento", `${d.mantenimiento}/mes`]);
    }
    if (d.arreglo) filas.push(["Arreglo suelto", d.arreglo]);
    if (d.codigo && d.codigo !== "—") filas.push(["Liberar el código", d.codigo]);

    const gar = pd.querySelector("[data-pd-garantia]");
    if (gar) {
      gar.innerHTML = d.mantenimiento && d.mantenimiento !== "—"
        ? `<b>Los primeros 6 meses</b> arreglamos sin costo lo que deje de funcionar. Después elegís: plan mensual de <b>${d.mantenimiento}</b> con dos cambios incluidos cada mes, o arreglos sueltos desde <b>${d.arreglo}</b> cuando los necesites.`
        : "";
      gar.hidden = !(d.mantenimiento && d.mantenimiento !== "—");
    }

    const nota = pd.querySelector("[data-pd-nota]");
    if (nota) {
      nota.textContent = d.nota || "";
      nota.hidden = !d.nota;
    }

    const aviso = pd.querySelector("[data-pd-aviso]");
    aviso.hidden = !conServidor;
    if (conServidor) {
      aviso.textContent = `Este producto necesita servidor. Te lo damos por ${d.servidor} al mes, o ponés el tuyo y lo configuramos sin costo. El mantenimiento es un plan aparte y cubre nuestro trabajo.`;
    }
    grid.innerHTML = filas
      .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`)
      .join("");

    campo("[data-pd-list]").innerHTML = d.incluye
      .split("|")
      .map((i) => `<li>${i}</li>`)
      .join("");
    campo("[data-pd-cta]").href = `https://wa.me/59175063505?text=${d.wa}`;
    pd.showModal();
  };

  document.querySelectorAll(".price-card").forEach((card) => {
    card.addEventListener("click", () => abrir(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrir(card);
      }
    });
  });

  pd.querySelector("[data-pd-close]")?.addEventListener("click", () => pd.close());
  pd.addEventListener("click", (event) => {
    if (event.target === pd) pd.close();
  });
}
