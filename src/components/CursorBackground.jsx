import { useEffect } from "react";

/*
  Fondo con logo que sigue el cursor suavemente (reemplaza initCursorBackground() de main.js).
  Solo se activa en PC con mouse real. No pinta nada: solo actualiza las variables CSS --cursor-x / --cursor-y.
*/
export default function CursorBackground() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let frame;

    const onMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 40; // desplazamiento máximo en px
      targetY = (e.clientY / window.innerHeight - 0.5) * 40;
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      document.documentElement.style.setProperty("--cursor-x", currentX.toFixed(2) + "px");
      document.documentElement.style.setProperty("--cursor-y", currentY.toFixed(2) + "px");
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
