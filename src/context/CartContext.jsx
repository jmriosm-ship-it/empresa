import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { lineKey } from "../utils/cartLine";

/*
  CARRITO (reemplaza js/cart.js)
  Se guarda en localStorage con la MISMA clave que la web vieja ("synkd_cart"),
  así los carritos que ya tengan clientes siguen funcionando.

  Cada línea se identifica por id + talla + color, para que la misma prenda en
  dos tallas o dos colores distintos sea dos líneas separadas.
*/

const CART_KEY = "synkd_cart";

const CartContext = createContext(null);

function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* modo privado / storage lleno: el carrito sigue funcionando en memoria */
    }
  }, [cart]);

  const addToCart = useCallback((product, qty = 1, size = null, color = null) => {
    const line = { id: product.id, name: product.name, price: product.price, image: product.image, size: size || null, color: color || null };
    const key = lineKey(line);
    setCart((prev) => {
      const existing = prev.find((item) => lineKey(item) === key);
      if (existing) {
        return prev.map((item) => (lineKey(item) === key ? { ...item, qty: item.qty + qty } : item));
      }
      return [...prev, { ...line, qty }];
    });
  }, []);

  const updateQty = useCallback((key, qty) => {
    setCart((prev) =>
      prev.map((item) => (lineKey(item) === key ? { ...item, qty } : item)).filter((item) => item.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((item) => lineKey(item) !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const value = useMemo(
    () => ({ cart, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount }),
    [cart, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
