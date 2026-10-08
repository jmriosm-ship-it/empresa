// Reemplaza a js/products.js
// Las categorías ahora viven en Supabase (tabla `categories`, se editan desde /admin).
// Esta lista es solo el respaldo: se usa mientras carga, o si Supabase no responde.
export const DEFAULT_CATEGORIES = [
  { slug: "tshirts", label: "T-Shirts", sizes: ["S", "M", "L", "XL", "XXL"], image_url: null, sort_order: 1 },
  { slug: "shorts", label: "Shorts", sizes: ["26", "28", "30", "32", "34", "36", "38"], image_url: null, sort_order: 2 },
  { slug: "alo", label: "Alo", sizes: ["S", "M", "L", "XL", "XXL"], image_url: null, sort_order: 3 },
];

// WhatsApp de la tienda, sin espacios ni "+", formato internacional
export const STORE_WHATSAPP = "15513128280";

export const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];