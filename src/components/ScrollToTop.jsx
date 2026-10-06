import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// En una web de varias páginas cada página nueva empieza arriba; en React hay que hacerlo a mano.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
