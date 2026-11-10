/*
 * Interacciones generales en JavaScript vanilla.
 * El contenido de las páginas está escrito directamente en los archivos HTML.
 */
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

  /* Los formularios se conectarán después a los servicios de tu proyecto. */
  document.querySelectorAll("[data-static-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });
})();
