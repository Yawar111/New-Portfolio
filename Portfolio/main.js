// Renders the Selected Work list from projects.json.
// Edit projects.json to add, remove, or reorder projects — no markup changes needed.

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function renderWork() {
  const mount = document.getElementById("work-list");
  if (!mount) return;

  let projects = [];
  try {
    const response = await fetch("./projects.json");
    if (!response.ok) throw new Error("Failed to load projects.json");
    projects = await response.json();
  } catch (error) {
    console.error(error);
    mount.innerHTML = '<li class="work__item"><p class="small" style="padding:28px 0">No projects to show.</p></li>';
    return;
  }

  mount.innerHTML = projects
    .map((project, index) => {
      const number = index + 1;
      return [
        '<li class="work__item reveal">',
        '  <a class="work__link" href="' + escapeHtml(project.link || "#") + '" target="_blank" rel="noreferrer">',
        '    <span class="work__index">' + number + "</span>",
        '    <img class="work__thumb" src="' + escapeHtml(project.image) + '" alt="' + escapeHtml(project.title) + '" loading="lazy" />',
        '    <span class="work__text">',
        '      <span class="title" style="display:block">' + escapeHtml(project.title) + "</span>",
        '      <span class="small work__summary">' + escapeHtml(project.summary) + "</span>",
        "    </span>",
        '    <span class="work__meta">',
        '      <span class="small">' + escapeHtml(project.stack) + "</span>",
        '      <span class="work__year">' + escapeHtml(project.year) + "</span>",
        "    </span>",
        "  </a>",
        "</li>"
      ].join("\n");
    })
    .join("\n");

  // Re-observe newly created work items
  observeRevealElements();
}

// ---------------------------------------------------------
// Scroll-reveal with IntersectionObserver
// ---------------------------------------------------------
function observeRevealElements() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    // Make everything visible immediately
    document.querySelectorAll(".reveal, .stagger-children").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

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
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  document.querySelectorAll(".reveal:not(.is-visible), .stagger-children:not(.is-visible)").forEach((el) => {
    observer.observe(el);
  });
}

// ---------------------------------------------------------
// Sticky nav scroll shadow
// ---------------------------------------------------------
function initNavScroll() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle("scrolled", window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ---------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------
function initMobileNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.classList.toggle("is-active", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close nav when a link is clicked
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });
}

// ---------------------------------------------------------
// Active nav link highlight on scroll
// ---------------------------------------------------------
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav__links a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute("href") === "#" + id
              ? "var(--ink)"
              : "";
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------
// Theme Toggle
// ---------------------------------------------------------
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const currentTheme = storedTheme || (prefersDark ? "dark" : "light");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    if (newTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  });
}

// ---------------------------------------------------------
// Initialize everything
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderWork();
  initNavScroll();
  initMobileNav();
  initActiveNavHighlight();
  initThemeToggle();
  // Observe static reveal elements
  observeRevealElements();
});
