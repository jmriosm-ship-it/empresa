import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useCategories } from "../context/CategoriesContext";

// Si la categoría tiene foto subida desde /admin, se usa esa; si no, queda la foto local (clase cat-<slug>) o el fondo liso
const tileStyle = (c) =>
  c.image_url
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.65)), url("${c.image_url}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

export default function Home() {
  const { categories } = useCategories();
  return (
    <>
      <section className="hero">
        <span className="hero-tag">SEPTEMBER 2026 CATALOG</span>
        <h1>SYNKD<br />STREETWEAR</h1>
        <p>Small batch drops. Loud graphics. Built for the street, not the shelf.</p>
        <div className="hero-cta">
          <Link to="/shop" className="btn btn-primary">Shop the drop</Link>
          <Link to="/contact" className="btn btn-outline">Contact us</Link>
        </div>
      </section>

      <div className="cat-grid">
        {categories.map((c) => (
          <Link key={c.slug} to={`/shop?cat=${c.slug}`} className={`cat-tile cat-${c.slug}`} style={tileStyle(c)}>
            <small>2026 / SEPTEMBER</small>
            <span>{c.label.toUpperCase()}</span>
          </Link>
        ))}
      </div>

      <section className="contact-list" style={{ paddingBottom: "20px" }}>
        <div className="contact-row">
          <span className="contact-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <a href="https://wa.me/15513128280" target="_blank" rel="noopener noreferrer">WhatsApp · 551 312-8280</a>
        </div>
        <div className="contact-row">
          <span className="contact-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </span>
          <a href="https://instagram.com/synkd.streetwear" target="_blank" rel="noopener noreferrer">@synkd.streetwear</a>
        </div>
      </section>

      <Footer />
    </>
  );
}