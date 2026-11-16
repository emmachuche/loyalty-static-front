
(() => {
  "use strict";

  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.getElementById("main-navigation");

  function closeMenu(returnFocus = false) {
    if (!menuButton || !navigation) {
      return;
    }

    const wasOpen = navigation.classList.contains("is-open");
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");

    if (wasOpen && returnFocus) {
      menuButton.focus();
    }
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-header")) {
        closeMenu();
      }
    });
  }
})();

/* Mismos filtros, aplicados a los bloques de destinos. */
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
    cards.forEach((card) => {
      const isVisible = destination === "todos" || card.dataset.destination === destination;

      card.hidden = !isVisible;
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.hotelFilter === destination;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (status) {
      const selectedButton = buttons.find((button) => button.dataset.hotelFilter === destination);
      status.textContent = `Destino seleccionado: ${selectedButton.textContent.trim()}`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      filterHotels(button.dataset.hotelFilter);
    });
  });

  filterHotels(catalog.dataset.initialFilter || "todos");
})();
