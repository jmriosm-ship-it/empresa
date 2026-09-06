/*
  PRODUCTS DATA
  -------------
  Por ahora estos productos están escritos aquí a mano (datos de ejemplo).
  En el siguiente paso vamos a reemplazar esta lista por productos que vengan
  de Firebase Firestore, para que tu amigo los pueda agregar/quitar desde el
  panel de administrador sin tocar código.

  Cada producto tiene: id, name, price (USD), category, image, sizes (tallas disponibles).
  Todas las prendas manejan las mismas tallas: S, M, L, XL, XXL.
*/

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

const PRODUCTS = [
  { id: "t1", name: "Black LV", price: 55, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t2", name: "White LV", price: 55, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t3", name: "Bape Popsicle", price: 42, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t4", name: "Bape Sta Tee", price: 42, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t5", name: "Bape Bathing Ape", price: 42, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t6", name: "White Godspeed", price: 44, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t7", name: "Iron Diamond", price: 46, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t8", name: "Black Roughplay", price: 50, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t9", name: "Green Roughplay", price: 47, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t10", name: "Amiri Theatres", price: 44, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t11", name: "Vale Red Dress", price: 46, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t12", name: "Hollywood Godspeed", price: 55, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t13", name: "Statue Godspeed", price: 45, category: "tshirts", image: "", sizes: ALL_SIZES },
  { id: "t14", name: "Angel Mixed Emotion", price: 35, category: "tshirts", image: "", sizes: ALL_SIZES },

  { id: "s1", name: "Amiri Shorts", price: 73, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s2", name: "Purple Shorts", price: 73, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s3", name: "Valley Shorts", price: 64, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s4", name: "Purple Spyder Short", price: 56, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s5", name: "EE Baggy Shorts", price: 30, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s6", name: "EE Clouds Shorts", price: 30, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s7", name: "EE Blue Shorts", price: 30, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s8", name: "ME Rhinestone", price: 30, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s9", name: "Grey ME Logo", price: 65, category: "shorts", image: "", sizes: ALL_SIZES },
  { id: "s10", name: "Black ME Logo", price: 65, category: "shorts", image: "", sizes: ALL_SIZES },

  { id: "a1", name: "Accolade Hoodie", price: 67, category: "alo", image: "", sizes: ALL_SIZES },
  { id: "a2", name: "Accolade 1/4 Zip Pullover", price: 65, category: "alo", image: "", sizes: ALL_SIZES },
  { id: "a3", name: "Accolade Full Zip Up", price: 70, category: "alo", image: "", sizes: ALL_SIZES },
  { id: "a4", name: "Joggers", price: 64, category: "alo", image: "", sizes: ALL_SIZES },
];

const CATEGORY_LABELS = {
  tshirts: "T-Shirts",
  shorts: "Shorts",
  alo: "Alo",
};