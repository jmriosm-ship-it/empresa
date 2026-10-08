import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCategories } from "../context/CategoriesContext";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartCount } = useCart();
  const { categories } = useCategories();
  const { pathname, search } = useLocation();
  const cat = new URLSearchParams(search).get("cat");

  function closeDrawer() {
    setDrawerOpen(false);
  }

  // Bloquear el scroll de la página mientras el menú está abierto (igual que main.js)
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Marca en el menú en qué página estás
  const active = (path, category = null) =>
    pathname === path && (category ? cat === category : !cat) ? "active" : "";

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l4 4 5-8 5 8 4-4-2 10H5L3 8z" />
          </svg>
          SYNKD
        </Link>
        <div className="header-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className={`cart-count ${cartCount > 0 ? "show" : ""}`}>{cartCount}</span>
          </Link>
          <button
            className={`menu-btn ${drawerOpen ? "open" : ""}`}
            aria-label="Menu"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`drawer-overlay ${drawerOpen ? "show" : ""}`} onClick={closeDrawer}></div>
      <nav className={`drawer ${drawerOpen ? "show" : ""}`}>
        <button className="drawer-close" aria-label="Close menu" onClick={closeDrawer}>✕</button>
        <ul className="drawer-nav">
          <li><Link to="/" className={active("/")} onClick={closeDrawer}>Home</Link></li>
          <li><Link to="/shop" className={active("/shop")} onClick={closeDrawer}>Shop All</Link></li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/shop?cat=${c.slug}`} className={active("/shop", c.slug)} onClick={closeDrawer}>{c.label}</Link>
            </li>
          ))}
          <li><Link to="/cart" className={active("/cart")} onClick={closeDrawer}>Cart</Link></li>
          <li><Link to="/policies" className={active("/policies")} onClick={closeDrawer}>Policies</Link></li>
          <li><Link to="/contact" className={active("/contact")} onClick={closeDrawer}>Contact</Link></li>
        </ul>
        <div className="drawer-contact">
          <strong>@synkd.streetwear</strong><br />
          WhatsApp 551 312-8280
        </div>
      </nav>
    </>
  );
}