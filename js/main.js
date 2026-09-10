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
