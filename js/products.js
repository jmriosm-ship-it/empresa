/*
  PRODUCTS DATA
  -------------
  Por ahora estos productos están escritos aquí a mano (datos de ejemplo).
  En el siguiente paso vamos a reemplazar esta lista por productos que vengan
  de Firebase Firestore, para que tu amigo los pueda agregar/quitar desde el
  panel de administrador sin tocar código.

  Cada producto tiene: id, name, price (USD), category, image (vacío por ahora).
*/

const PRODUCTS = [
  { id: "t1", name: "Black LV M/L", price: 55, category: "tshirts", image: "" },
  { id: "t2", name: "White LV M/L", price: 55, category: "tshirts", image: "" },
  { id: "t3", name: "Bape Popsicle S/M/L", price: 42, category: "tshirts", image: "" },
  { id: "t4", name: "Bape Sta Tee S/L", price: 42, category: "tshirts", image: "" },
  { id: "t5", name: "Bape Bathing Ape M/L", price: 42, category: "tshirts", image: "" },
  { id: "t6", name: "White Godspeed L", price: 44, category: "tshirts", image: "" },
  { id: "t7", name: "Iron Diamond M/L", price: 46, category: "tshirts", image: "" },
  { id: "t8", name: "Black Roughplay", price: 50, category: "tshirts", image: "" },
  { id: "t9", name: "Green Roughplay", price: 47, category: "tshirts", image: "" },
  { id: "t10", name: "Amiri Theatres M/L", price: 44, category: "tshirts", image: "" },
  { id: "t11", name: "Vale Red Dress M/L", price: 46, category: "tshirts", image: "" },
  { id: "t12", name: "Hollywood Godspeed L", price: 55, category: "tshirts", image: "" },
  { id: "t13", name: "Statue Godspeed M", price: 45, category: "tshirts", image: "" },
  { id: "t14", name: "Angel Mixed Emotion S/M", price: 35, category: "tshirts", image: "" },

  { id: "s1", name: "Amiri Shorts S/M/L", price: 73, category: "shorts", image: "" },
  { id: "s2", name: "Purple Shorts S/M/L", price: 73, category: "shorts", image: "" },
  { id: "s3", name: "Valley Shorts M/L", price: 64, category: "shorts", image: "" },
  { id: "s4", name: "Purple Spyder Short M/L", price: 56, category: "shorts", image: "" },
  { id: "s5", name: "EE Baggy Shorts S", price: 30, category: "shorts", image: "" },
  { id: "s6", name: "EE Clouds Shorts S/M", price: 30, category: "shorts", image: "" },
  { id: "s7", name: "EE Blue Shorts M", price: 30, category: "shorts", image: "" },
  { id: "s8", name: "ME Rhinestone M/L", price: 30, category: "shorts", image: "" },
  { id: "s9", name: "Grey ME Logo M", price: 65, category: "shorts", image: "" },
  { id: "s10", name: "Black ME Logo M", price: 65, category: "shorts", image: "" },

  { id: "a1", name: "Accolade Hoodie S/M/L", price: 67, category: "alo", image: "" },
  { id: "a2", name: "Accolade 1/4 Zip Pullover", price: 65, category: "alo", image: "" },
  { id: "a3", name: "Accolade Full Zip Up M", price: 70, category: "alo", image: "" },
  { id: "a4", name: "Joggers S/M/L", price: 64, category: "alo", image: "" },
];

const CATEGORY_LABELS = {
  tshirts: "T-Shirts",
  shorts: "Shorts",
  alo: "Alo",
};
