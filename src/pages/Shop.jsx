import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sb } from "../lib/supabase";
import { useCategories } from "../context/CategoriesContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import useReveal from "../hooks/useReveal";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const { categories, bySlug, loaded } = useCategories();
  // mientras cargan las categorías no se descarta un ?cat= desconocido (puede ser una categoría nueva)
  const currentCat = catParam && (bySlug[catParam] || !loaded) ? catParam : "all";
  const tabs = [{ slug: "all", label: "All" }, ...categories];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        setError(true);
      } else {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image_url,
          }))
        );
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    let list = currentCat === "all" ? products : products.filter((p) => p.category === currentCat);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    return list;
  }, [products, currentCat, search]);

  useReveal(items);

  function selectCat(cat) {
    setSearchParams(cat === "all" ? {} : { cat }, { replace: true });
  }

  return (
    <>
      <div className="section-head">
        <div>
          <div className="meta"><span>2026</span><span>SEPTEMBER</span></div>
          <h2>{currentCat === "all" ? "SHOP" : (bySlug[currentCat]?.label ?? "").toUpperCase()}</h2>
        </div>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.slug} className={`tab ${currentCat === t.slug ? "active" : ""}`} onClick={() => selectCat(t.slug)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="search-wrap">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton skeleton-media"></div>
              <div className="skeleton skeleton-line"></div>
              <div className="skeleton skeleton-line short"></div>
            </div>
          ))}

        {!loading && error && (
          <p style={{ padding: "60px 24px", color: "#c0533e", gridColumn: "1/-1", textAlign: "center" }}>
            Could not load products right now.
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p style={{ padding: "60px 24px", color: "var(--text-dim)", gridColumn: "1/-1", textAlign: "center" }}>
            No products found — try a different search or category.
          </p>
        )}

        {!loading && !error && items.map((p, i) => <ProductCard key={p.id} product={p} index={i} reveal />)}
      </div>

      <Footer />
    </>
  );
}