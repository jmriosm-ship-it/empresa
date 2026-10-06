// Identifica una línea del carrito: misma prenda en otra talla o color = otra línea
export function lineKey(item) {
  return [item.id, item.size || "", item.color || ""].join("|");
}
