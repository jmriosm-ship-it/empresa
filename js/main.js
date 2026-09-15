/* Shared UI behavior: hamburger drawer menu, present on every page */
 
function initDrawer() {
  const menuBtn = document.querySelector(".menu-btn");
  const drawer = document.querySelector(".drawer");
  const overlay = document.querySelector(".drawer-overlay");
  const closeBtn = document.querySelector(".drawer-close");
  if (!menuBtn || !drawer || !overlay) return;
 
  function open() {
    drawer.classList.add("show");
    overlay.classList.add("show");
    menuBtn.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    drawer.classList.remove("show");
    overlay.classList.remove("show");
    menuBtn.classList.remove("open");
    document.body.style.overflow = "";
  }
 
  menuBtn.addEventListener("click", () => {
    drawer.classList.contains("show") ? close() : open();
  });
  overlay.addEventListener("click", close);
  if (closeBtn) closeBtn.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}
 
document.addEventListener("DOMContentLoaded", initDrawer);
 
/* Fondo con logo que sigue el cursor suavemente (solo en pc, con mouse real) */
function initCursorBackground() {
  const hasMouse = window.matchMedia("(pointer: fine)").matches;
  if (!hasMouse) return;
 
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
 
  window.addEventListener("mousemove", (e) => {
    const xPct = (e.clientX / window.innerWidth - 0.5); // -0.5 a 0.5
    const yPct = (e.clientY / window.innerHeight - 0.5);
    targetX = xPct * 40; // desplazamiento máximo en px
    targetY = yPct * 40;
  });
 
  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    document.documentElement.style.setProperty("--cursor-x", currentX.toFixed(2) + "px");
    document.documentElement.style.setProperty("--cursor-y", currentY.toFixed(2) + "px");
    requestAnimationFrame(animate);
  }
  animate();
}
document.addEventListener("DOMContentLoaded", initCursorBackground);
 