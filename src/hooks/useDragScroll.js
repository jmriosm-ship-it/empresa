import { useEffect } from "react";

/*
  Scroll horizontal arrastrando con el mouse (la fila "You might also like").
  Si el usuario arrastró, se cancela el click para no abrir el producto por accidente.
*/
export default function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let moved = false;

    const stop = () => {
      isDown = false;
      el.classList.remove("dragging");
    };
    const onDown = (e) => {
      isDown = true;
      moved = false;
      el.classList.add("dragging");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const walk = e.pageX - el.offsetLeft - startX;
      if (Math.abs(walk) > 5) moved = true;
      el.scrollLeft = scrollLeft - walk;
    };
    const onClickCapture = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", stop);
    el.addEventListener("click", onClickCapture, true);
    window.addEventListener("mouseup", stop);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", stop);
      el.removeEventListener("click", onClickCapture, true);
      window.removeEventListener("mouseup", stop);
    };
  }, [ref]);
}
