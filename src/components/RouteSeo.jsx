import { useLocation } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext";
import useSeo from "../hooks/useSeo";

const BRAND = "SYNKD Streetwear";

const PAGES = {
  "/": {
    title: BRAND,
    description: "SYNKD Streetwear — small batch streetwear drops. Shop T-shirts, shorts, and Alo pieces. Built for the street, not the shelf.",
  },
  "/contact": {
    title: `Contact | ${BRAND}`,
    description: "Get in touch with SYNKD Streetwear for orders, sizing questions and support.",
  },
  "/policies": {
    title: `Policies | ${BRAND}`,
    description: "Shipping, returns and store policies for SYNKD Streetwear.",
  },
  "/cart": { title: `Cart | ${BRAND}`, description: "Your cart.", noindex: true },
  "/checkout": { title: `Checkout | ${BRAND}`, description: "Checkout.", noindex: true },
  "/admin": { title: `Admin | ${BRAND}`, description: "Admin.", noindex: true },
};

// /product lo maneja Product.jsx con los datos del producto
export default function RouteSeo() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const { bySlug } = useCategories();

  let seo;
  let path = pathname;

  if (pathname === "/shop") {
    const cat = params.get("cat");
    const label = cat && bySlug[cat] ? bySlug[cat].label : null;
    seo = label
      ? { title: `${label} | ${BRAND}`, description: `Shop ${label} from SYNKD Streetwear — small batch streetwear drops.` }
      : { title: `Shop | ${BRAND}`, description: "Shop all SYNKD Streetwear pieces: T-shirts, shorts and Alo. Small batch drops." };
    if (label) path = `/shop?cat=${cat}`;
  } else if (pathname === "/product") {
    seo = null;
  } else if (PAGES[pathname]) {
    seo = PAGES[pathname];
  } else {
    seo = { title: `Page not found | ${BRAND}`, description: "This page does not exist.", noindex: true };
  }

  useSeo({
    title: seo?.title ?? BRAND,
    description: seo?.description ?? "",
    path,
    noindex: seo?.noindex ?? false,
    skip: !seo,
  });
  return null;
}