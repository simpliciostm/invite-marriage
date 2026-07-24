const WEDDING_DATE = "2026-09-06T16:30:00-03:00";

const envelopeScreen = document.querySelector(".envelope-screen");
const envelope = document.querySelector("#envelope");
const openButtons = document.querySelectorAll(".js-open-invite");
const mainContent = document.querySelector("#main-content");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("envelope-locked");

function setOpenButtonsDisabled(disabled) {
  openButtons.forEach((button) => {
    button.disabled = disabled;
    button.setAttribute("aria-expanded", String(disabled));
  });
}

function revealInvitation() {
  if (!envelopeScreen || !envelope || !mainContent) {
    return;
  }

  setOpenButtonsDisabled(true);
  mainContent.hidden = false;

  if (prefersReducedMotion) {
    mainContent.classList.add("is-visible");
    revealItems.forEach((item) => item.classList.add("is-visible"));
    envelopeScreen.classList.add("is-hidden");
    envelopeScreen.hidden = true;
    document.body.classList.remove("envelope-locked");
    mainContent.focus({ preventScroll: true });
    return;
  }

  envelopeScreen.classList.add("is-opening");
  envelope.classList.add("is-open");

  window.setTimeout(() => {
    envelopeScreen.classList.add("is-revealing");
    mainContent.classList.add("is-visible");
  }, 900);

  window.setTimeout(() => {
    envelopeScreen.classList.add("is-hidden");
    envelopeScreen.hidden = true;
    document.body.classList.remove("envelope-locked");
    mainContent.focus({ preventScroll: true });
  }, 1850);
}

function startRevealObserver() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
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
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function updateCountdown() {
  const countdown = document.querySelector("[data-countdown]");

  if (!countdown) {
    return;
  }

  const targetDate = new Date(WEDDING_DATE).getTime();
  const now = Date.now();
  const distance = Math.max(0, targetDate - now);
  const secondsTotal = Math.floor(distance / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  countdown.querySelector("[data-days]").textContent = days;
  countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
  countdown.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
}

openButtons.forEach((button) => {
  button.addEventListener("click", revealInvitation, { once: true });
});

startRevealObserver();
updateCountdown();
window.setInterval(updateCountdown, 1000);
