/*
 * Carruseles independientes, sin dependencias externas.
 *
 * Para agregar diapositivas, añade más elementos <li data-carousel-slide>
 * dentro de la lista existente. No es necesario modificar este archivo.
 * Las fotografías y tarjetas siempre permanecen en el HTML.
 */
(() => {
  "use strict";

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const previousButton = carousel.querySelector("[data-carousel-previous]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const status = carousel.querySelector("[data-carousel-status]");
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));

    if (!track || !previousButton || !nextButton || slides.length === 0) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = null;

    function getSlideStep() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap);
      return slideWidth + (Number.isFinite(gap) ? gap : 0);
    }

    function updateControls() {
      const maximumScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const currentScroll = Math.max(0, track.scrollLeft);

      previousButton.disabled = currentScroll <= 2;
      nextButton.disabled = currentScroll >= maximumScroll - 2;

      if (status) {
        const step = getSlideStep();
        const firstVisible = Math.min(
          slides.length,
          Math.floor((currentScroll + 2) / Math.max(step, 1)) + 1,
        );
        const visibleCount = Math.max(1, Math.round(track.clientWidth / Math.max(step, 1)));
        const lastVisible = Math.min(slides.length, firstVisible + visibleCount - 1);

        status.textContent = `Diapositivas ${firstVisible} a ${lastVisible} de ${slides.length}`;
      }
    }

    function scheduleUpdate() {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateControls();
      });
    }

    function move(direction) {
      const step = getSlideStep();
      const maximumScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const slideIndex = Math.round(track.scrollLeft / Math.max(step, 1));
      const destination = Math.min(maximumScroll, Math.max(0, (slideIndex + direction) * step));

      track.scrollTo({
        left: destination,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    }

    previousButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));
    track.addEventListener("scroll", scheduleUpdate, { passive: true });

    /* Las flechas se aplican cuando el foco está en la lista del carrusel. */
    track.addEventListener("keydown", (event) => {
      if (event.target !== track) {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        track.scrollTo({
          left: event.key === "Home" ? 0 : track.scrollWidth,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      }
    });

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(track);
    } else {
      window.addEventListener("resize", scheduleUpdate);
    }

    updateControls();
  });
})();
