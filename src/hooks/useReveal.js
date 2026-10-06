import { useEffect } from "react";

/*
  Animación de aparición al hacer scroll (reemplaza observeReveals() de main.js).
  Ponle la clase "reveal" a los elementos y llama useReveal(dato) en el componente.
  Pasa como argumento el dato que cambia cuando cambian los elementos (ej. la lista de productos).
*/
export default function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.revealed)");

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [dep]);
}
