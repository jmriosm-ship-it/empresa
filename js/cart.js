/*
  CART LOGIC
  ----------
  El carrito se guarda en localStorage del navegador, así que se mantiene
  aunque el cliente cierre la pestaña y vuelva más tarde (mientras use el
  mismo navegador). No necesita servidor.
 
  Cada línea del carrito se identifica por id + size, para que la misma
  prenda en dos tallas distintas aparezca como dos líneas separadas.
*/
 
const CART_KEY = "synkd_cart";
 
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
 
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
 
function addToCart(product, qty = 1, size = null) {
  size = size || null;
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id && (item.size || null) === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, size, qty });
  }
  saveCart(cart);
}
 
function updateQty(id, size, qty) {
  size = size || null;
  let cart = getCart();
  cart = cart
    .map((item) => (item.id === id && (item.size || null) === size ? { ...item, qty } : item))
    .filter((item) => item.qty > 0);
  saveCart(cart);
}
 
function removeFromCart(id, size) {
  size = size || null;
  const cart = getCart().filter((item) => !(item.id === id && (item.size || null) === size));
  saveCart(cart);
}
 
function clearCart() {
  saveCart([]);
}
 
function cartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}
 
function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
 
function updateCartBadge() {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;
  const count = cartCount();
  badge.textContent = count;
  badge.classList.toggle("show", count > 0);
}
 
document.addEventListener("DOMContentLoaded", updateCartBadge);
 