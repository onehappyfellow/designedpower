// Preserve the existing mobile menu and expandable disclaimer.
const navigation = document.querySelector("#site-navigation");
const menuToggle = navigation?.querySelector(".menu-toggle");
menuToggle?.addEventListener("click", () => {
  const expanded = navigation.classList.toggle("toggled");
  menuToggle.setAttribute("aria-expanded", String(expanded));
});

const disclaimerMore = document.querySelector("#disclaimer_more");
disclaimerMore?.addEventListener("click", (event) => {
  event.preventDefault();
  for (const paragraph of document.querySelector("#disclaimer").children) {
    paragraph.classList.add("more-visible");
  }
});

// Desktop rotates unless reduced motion is requested; mobile stays static.
const slideshow = document.querySelector(".slideshow");
if (slideshow) {
  const slides = [...slideshow.querySelectorAll(".slideshow-slide")];
  const controls = slideshow.querySelector(".slideshow-controls");
  const rotationButtons = [...slideshow.querySelectorAll("[data-rotation]")];
  const status = slideshow.querySelector(".slideshow-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  );
  let current = 0;
  let playing = false;
  let hovered = false;
  let timer;

  function show(index, announce = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== current;
    });
    // Automatic changes stay silent; announce only explicit navigation.
    status.setAttribute("aria-live", announce ? "polite" : "off");
    status.textContent = announce
      ? slides[current].querySelector("img").alt
      : "";
  }

  function schedule() {
    window.clearInterval(timer);
    if (playing && desktop.matches && !hovered && !document.hidden) {
      timer = window.setInterval(() => show(current + 1), 5000);
    }
  }

  function setPlaying(value) {
    playing = value;
    for (const button of rotationButtons) {
      button.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
      button.dataset.playing = String(playing);
    }
    schedule();
  }

  for (const button of rotationButtons) {
    button.addEventListener("click", () => setPlaying(!playing));
  }
  for (const [selector, step] of [
    ["[data-previous]", -1],
    ["[data-next]", 1],
  ]) {
    slideshow.querySelector(selector).addEventListener("click", () => {
      setPlaying(false);
      show(current + step, true);
    });
  }
  slideshow.addEventListener("focusin", (event) => {
    if (!rotationButtons.includes(event.target)) setPlaying(false);
  });
  slideshow.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    schedule();
  });
  slideshow.addEventListener("pointerleave", () => {
    hovered = false;
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", () => setPlaying(false));
  function updateLayout() {
    setPlaying(desktop.matches && !reducedMotion.matches);
    show(0);
    controls.hidden = !desktop.matches;
    if (desktop.matches) {
      slideshow.setAttribute("aria-roledescription", "carousel");
    } else {
      slideshow.removeAttribute("aria-roledescription");
    }
  }
  desktop.addEventListener("change", updateLayout);
  updateLayout();
}
