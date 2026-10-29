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
