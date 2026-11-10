/* Filtros de presentación en memoria; no consultan ninguna API. */
(() => {
  "use strict";

  const catalog = document.querySelector("[data-hotel-catalog]");

  if (!catalog) {
    return;
  }

  const buttons = Array.from(catalog.querySelectorAll("[data-hotel-filter]"));
  const cards = Array.from(catalog.querySelectorAll("[data-hotel-card]"));
  const status = catalog.querySelector("[data-hotel-results]");

  function filterHotels(destination) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const isVisible = destination === "todos" || card.dataset.destination === destination;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.hotelFilter === destination;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (status) {
      status.textContent = `${visibleCount} ${visibleCount === 1 ? "hotel disponible" : "hoteles disponibles"}`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      filterHotels(button.dataset.hotelFilter);
    });
  });

  filterHotels("todos");
})();
