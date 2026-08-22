const body = document.body;
const currentYear = document.querySelector("#current-year");
const themeToggle = document.querySelector("#theme-toggle");
const themeToggleLabel = document.querySelector("#theme-toggle-label");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

function getTimeState() {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour >= 5 && hour < 7) {
    return {
      name: "dawn",
      brightness: 0.9,
      saturation: 1,
      tint: "rgba(218, 135, 148, 0.18)",
    };
  }

  if (hour >= 7 && hour < 11) {
    return {
      name: "morning",
      brightness: 1.06,
      saturation: 1.08,
      tint: "rgba(255, 205, 177, 0.12)",
    };
  }

  if (hour >= 11 && hour < 16) {
    return {
      name: "afternoon",
      brightness: 1.12,
      saturation: 1.12,
      tint: "rgba(255, 220, 182, 0.08)",
    };
  }

  if (hour >= 16 && hour < 19) {
    return {
      name: "evening",
      brightness: 0.96,
      saturation: 1.08,
      tint: "rgba(244, 138, 124, 0.2)",
    };
  }

  if (hour >= 22 || hour < 3) {
    return {
      name: "late-night",
      brightness: 0.72,
      saturation: 0.86,
      tint: "rgba(37, 34, 93, 0.32)",
    };
  }

  return {
    name: "night",
    brightness: 0.8,
    saturation: 0.9,
    tint: "rgba(46, 30, 77, 0.24)",
  };
}

function updateEnvironment() {
  const state = getTimeState();
  body.dataset.timePhase = state.name;
  body.style.setProperty("--environment-brightness", state.brightness);
  body.style.setProperty("--environment-saturation", state.saturation);
  body.style.setProperty("--environment-tint", state.tint);
}

function readStoredTheme() {
  try {
    return window.localStorage.getItem("portfolio-theme");
  } catch (error) {
    return null;
  }
}

function writeStoredTheme(theme) {
  try {
    window.localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    // Storage may be unavailable (private browsing, local file access, etc.);
    // the toggle still works for the current session either way.
  }
}

const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: light)");

function getSavedTheme() {
  const savedTheme = readStoredTheme();

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return colorSchemeQuery.matches ? "light" : "dark";
}

function setTheme(theme, remember = false) {
  const isLight = theme === "light";

  body.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(isLight));
  themeToggle?.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode",
  );

  if (themeToggleLabel) {
    themeToggleLabel.textContent = isLight ? "dark" : "light";
  }

  if (themeToggleIcon) {
    themeToggleIcon.textContent = isLight ? "◑" : "◐";
  }

  if (remember) {
    writeStoredTheme(theme);
  }
}

setTheme(getSavedTheme());
updateEnvironment();
window.setInterval(updateEnvironment, 60_000);

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "light" ? "dark" : "light";
  setTheme(nextTheme, true);
});

// If the visitor never picked a theme manually, keep following their
// system preference live (e.g. their OS switching to dark mode at night).
colorSchemeQuery.addEventListener("change", (event) => {
  if (readStoredTheme()) {
    return;
  }

  setTheme(event.matches ? "light" : "dark");
});

function updateScrollState() {
  body.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.28);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();
