import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sb } from "../lib/supabase";
import { DEFAULT_SIZES } from "../constants";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Footer from "../components/Footer";
import Reviews from "../components/Reviews";
import RelatedProducts from "../components/RelatedProducts";
import "../assets/product.css";
import useSeo from "../hooks/useSeo";

/*
  La URL sigue siendo /product?id=XXXX (igual que antes con product.html?id=XXXX).
  El `key={id}` hace que, al pasar de un producto a otro (ej. desde "You might also like"),
  React reinicie todo el estado de la página automáticamente.
*/
export default function Product() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  return <ProductPage key={id} id={id} />;
}

function NotFoundMsg() {
  return <p style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-dim)" }}>Product not found.</p>;
}

function ProductPage({ id }) {
  const [status, setStatus] = useState("loading"); // loading | ready | notfound
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    window.scrollTo(0, 0);
    (async () => {
      const { data, error } = await sb.from("products").select("*").eq("id", id).single();
      if (cancelled) return;
      if (error || !data) {
        setStatus("notfound");
      } else {
        setProduct(data);
        setStatus("ready");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  let content;
  if (!id || status === "notfound") {
    content = <NotFoundMsg />;
  } else if (status === "loading") {
    content = (
      <div className="product-wrap">
        <div>
          <div className="skeleton" style={{ aspectRatio: "1/1", borderRadius: "var(--radius-lg)", marginBottom: "14px" }}></div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="skeleton" style={{ width: "74px", height: "74px", borderRadius: "12px" }}></div>
            <div className="skeleton" style={{ width: "74px", height: "74px", borderRadius: "12px" }}></div>
          </div>
        </div>
        <div>
          <div className="skeleton" style={{ height: "38px", width: "70%", marginBottom: "14px" }}></div>
          <div className="skeleton" style={{ height: "24px", width: "30%", marginBottom: "24px" }}></div>
          <div className="skeleton" style={{ height: "44px", width: "100%", marginBottom: "14px" }}></div>
          <div className="skeleton" style={{ height: "44px", width: "100%" }}></div>
        </div>
      </div>
    );
  } else {
    content = <ProductDetail product={product} />;
  }

  return (
    <>
      {content}
      <Footer />
    </>
  );
}

function ProductDetail({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // ---- datos derivados del producto (misma lógica que product.html) ----
  const photos =
    product.photos && product.photos.length
      ? product.photos
      : product.image_url
      ? [{ url: product.image_url, color: "" }, ...(product.extra_images || []).map((u) => ({ url: u, color: "" }))]
      : [];
  const colorSet = [...new Set(photos.map((p) => p.color).filter(Boolean))];
  const sizes = product.sizes && product.sizes.length ? product.sizes : DEFAULT_SIZES;
  const stock = product.stock || {};
  const hasStockData = Object.keys(stock).length > 0;
  const isSoldOut = hasStockData && sizes.every((s) => (stock[s] || 0) <= 0);
  const firstAvailable = sizes.find((s) => !hasStockData || (stock[s] || 0) > 0) || sizes[0];

  // ---- selección del cliente ----
  const [mainUrl, setMainUrl] = useState(photos[0]?.url || null);
  const [selectedColor, setSelectedColor] = useState(colorSet[0] || null);
  const [selectedSize, setSelectedSize] = useState(firstAvailable);
  const [qty, setQty] = useState(1);
    const desc = (product.description || "").replace(/\s+/g, " ").trim();
  useSeo({
    title: `${product.name} | SYNKD Streetwear`,
    description: desc ? desc.slice(0, 155) : `${product.name} — $${product.price} USD. Small batch streetwear from SYNKD.`,
    path: `/product?id=${product.id}`,
    image: photos[0]?.url || product.image_url || undefined,
  });
  const [lightbox, setLightbox] = useState(false);

  const maxQty = hasStockData ? Math.max(1, stock[selectedSize] || 0) : 99;

  function pickThumb(photo) {
    setMainUrl(photo.url);
    if (photo.color) setSelectedColor(photo.color);
  }

  function pickColor(color) {
    setSelectedColor(color);
    const match = photos.find((p) => p.color === color);
    if (match) setMainUrl(match.url);
  }

  function pickSize(size) {
    const outOfStock = hasStockData && (stock[size] || 0) <= 0;
    if (outOfStock) return;
    setSelectedSize(size);
    setQty(1);
  }

  function handleAdd() {
    addToCart(
      { id: product.id, name: product.name, price: product.price, image: product.image_url },
      qty,
      selectedSize,
      selectedColor
    );
    showToast("Added to cart");
  }

  return (
    <>
      <div className="product-wrap">
        <div>
          <div className="pg-main" onClick={() => mainUrl && setLightbox(true)}>
            {mainUrl ? <img src={mainUrl} alt={product.name} /> : <span className="placeholder">PHOTO COMING SOON</span>}
          </div>
          {photos.length > 1 && (
            <div className="pg-thumbs">
              {photos.map((p, i) => (
                <div key={i} className={`pg-thumb ${p.url === mainUrl ? "active" : ""}`} onClick={() => pickThumb(p)}>
                  <img src={p.url} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="pi-name">{product.name}</h1>
          <div className="pi-price">${product.price} USD</div>

          {colorSet.length > 0 && (
            <div className="pi-section">
              <span className="pi-label">Color: <span>{selectedColor}</span></span>
              <div className="pi-colors">
                {colorSet.map((c) => (
                  <div
                    key={c}
                    className={`pi-color ${c === selectedColor ? "active" : ""}`}
                    style={{ background: c }}
                    title={c}
                    onClick={() => pickColor(c)}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div className="pi-section">
            <span className="pi-label">Size {isSoldOut && <span className="sold-out-badge">SOLD OUT</span>}</span>
            <div className="pi-sizes">
              {sizes.map((s) => {
                const outOfStock = hasStockData && (stock[s] || 0) <= 0;
                return (
                  <div
                    key={s}
                    className={`pi-size-btn ${s === selectedSize ? "active" : ""} ${outOfStock ? "out-of-stock" : ""}`}
                    onClick={() => pickSize(s)}
                  >
                    {s}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pi-section">
            <span className="pi-label">Quantity</span>
            <div className="pi-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>+</button>
            </div>
          </div>

          <button className="btn btn-primary btn-full" disabled={isSoldOut} onClick={handleAdd}>
            {isSoldOut ? "Sold out" : "Add to cart"}
          </button>
        </div>
      </div>

      {product.description && (
        <div className="product-details-wrap">
          <h3 className="pd-title">Product Details</h3>
          <p className="pi-desc">{product.description}</p>
        </div>
      )}

      <RelatedProducts category={product.category} excludeId={product.id} />
      <Reviews productId={product.id} />

      <div
        className={`lightbox-overlay ${lightbox ? "show" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget || e.target.tagName === "IMG") setLightbox(false);
        }}
      >
        <button className="lightbox-close" onClick={() => setLightbox(false)}>&times;</button>
        <img src={mainUrl || undefined} alt={product.name} />
      </div>
    </>
  );
}
