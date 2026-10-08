import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sb } from "../lib/supabase";
import { DEFAULT_SIZES } from "../constants";
import { useCategories } from "../context/CategoriesContext";
import "../assets/admin.css";

/* ---------- helpers ---------- */

// Arma la lista de tallas con su casilla y cantidad (reemplaza renderSizeStockInputs)
// categorySizes = tallas de la categoría; si el producto ya tenía otras tallas/stock, también se muestran para no perderlas
function buildSizeRows(categorySizes, existingStock = {}, existingSizes = []) {
  const noStockYet = Object.keys(existingStock).length === 0;
  const all = [...categorySizes];
  [...existingSizes, ...Object.keys(existingStock)].forEach((sz) => {
    if (!all.includes(sz)) all.push(sz);
  });
  return all.map((size) => ({
    size,
    checked: existingStock[size] !== undefined || noStockYet,
    qty: existingStock[size] !== undefined ? String(existingStock[size]) : "",
  }));
}

// "Gorras de Verano" -> "gorras-de-verano" (sin tildes ni símbolos)
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "S, M, L" -> ["S","M","L"] (sin vacíos ni repetidos)
function parseSizes(text) {
  return [...new Set(text.split(",").map((x) => x.trim()).filter(Boolean))];
}

async function uploadImage(file) {
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
  const { error } = await sb.storage.from("product-images").upload(filePath, file);
  if (error) throw error;
  const { data } = sb.storage.from("product-images").getPublicUrl(filePath);
  return data.publicUrl;
}

/* ---------- página ---------- */

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = todavía comprobando

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l4 4 5-8 5 8 4-4-2 10H5L3 8z" />
          </svg>
          SYNKD
        </Link>
      </header>

      <div className="admin-wrap">
        {session === null && <LoginBox />}
        {session && <AdminPanel email={session.user.email} />}
      </div>
    </>
  );
}

/* ---------- login ---------- */

function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", cls: "" });

  async function handleLogin() {
    setMsg({ text: "Logging in…", cls: "" });
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setMsg({ text: error.message, cls: "err" });
    // si todo sale bien, onAuthStateChange en <Admin> muestra el panel solo
  }

  return (
    <div className="admin-box">
      <h3>Admin Login</h3>
      <div className="admin-field">
        <label>Email</label>
        <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="admin-field">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
      </div>
      <button className="btn-primary" onClick={handleLogin}>Log In</button>
      <p className={`admin-msg ${msg.cls}`}>{msg.text}</p>
    </div>
  );
}

/* ---------- panel (formulario + lista de productos) ---------- */

function AdminPanel({ email }) {
  const { categories, bySlug } = useCategories();
  const sizesOf = (slug) => bySlug[slug]?.sizes || DEFAULT_SIZES;
  const firstSlug = categories[0]?.slug || "";

  const [products, setProducts] = useState(null); // null = cargando
  const [listError, setListError] = useState("");

  const [editingId, setEditingId] = useState(null); // null = agregando uno nuevo
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(firstSlug);
  const [sizeRows, setSizeRows] = useState(() => buildSizeRows(sizesOf(firstSlug)));
  const [files, setFiles] = useState([null, null, null, null]);
  const [colors, setColors] = useState(["", "", "", ""]);
  const [fileKey, setFileKey] = useState(0); // cambiarlo "vacía" los <input type="file">
  const [msg, setMsg] = useState({ text: "", cls: "" });

  const [version, setVersion] = useState(0); // súbelo para volver a cargar la lista
  const loadProducts = () => setVersion((v) => v + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        setListError(error.message);
        setProducts([]);
        return;
      }
      setListError("");
      setProducts(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory(firstSlug);
    setSizeRows(buildSizeRows(sizesOf(firstSlug)));
    setFiles([null, null, null, null]);
    setColors(["", "", "", ""]);
    setFileKey((k) => k + 1);
  }

  function changeCategory(newCategory) {
    setCategory(newCategory);
    setSizeRows(buildSizeRows(sizesOf(newCategory)));
  }

  function startEdit(product) {
    const cat = product.category || firstSlug;
    setEditingId(product.id);
    setName(product.name || "");
    setPrice(product.price || "");
    setDescription(product.description || "");
    setCategory(cat);
    const rows = buildSizeRows(sizesOf(cat), product.stock || {}, product.sizes || []).map((r) => ({
      ...r,
      checked: (product.sizes || []).includes(r.size),
    }));
    setSizeRows(rows);
    setFiles([null, null, null, null]);
    setColors(["", "", "", ""]);
    setFileKey((k) => k + 1);
    setMsg({ text: "", cls: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await sb.from("products").delete().eq("id", id);
    loadProducts();
  }

  function updateRow(size, patch) {
    setSizeRows((rows) => rows.map((r) => (r.size === size ? { ...r, ...patch } : r)));
  }

  async function handleSave() {
    const priceNum = parseFloat(price);

    const sizes = [];
    const stock = {};
    sizeRows.forEach((r) => {
      if (r.checked) {
        sizes.push(r.size);
        stock[r.size] = parseInt(r.qty) || 0;
      }
    });

    const slots = files
      .map((file, i) => ({ file, color: colors[i].trim() }))
      .filter((s) => s.file);

    if (!name.trim() || !priceNum || sizes.length === 0) {
      setMsg({ text: "Please fill in name, price, and at least one size.", cls: "err" });
      return;
    }
    if (!editingId && slots.length === 0) {
      setMsg({ text: "Please add at least Photo 1.", cls: "err" });
      return;
    }

    setMsg({ text: slots.length ? "Uploading photos…" : "Saving product…", cls: "" });

    try {
      const payload = { name: name.trim(), price: priceNum, description: description.trim(), category, sizes, stock };

      if (slots.length > 0) {
        const photos = [];
        for (const slot of slots) {
          const url = await uploadImage(slot.file);
          photos.push({ url, color: slot.color || "" });
        }
        payload.photos = photos;
        payload.image_url = photos[0].url;
      }

      setMsg({ text: "Saving product…", cls: "" });

      const { error: dbError } = editingId
        ? await sb.from("products").update(payload).eq("id", editingId)
        : await sb.from("products").insert(payload);
      if (dbError) throw dbError;

      setMsg({ text: editingId ? "Product updated!" : "Product added!", cls: "ok" });
      resetForm();
      loadProducts();
    } catch (err) {
      setMsg({ text: err.message || "Something went wrong.", cls: "err" });
    }
  }

  return (
    <div id="adminPanel">
      <div className="admin-box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", color: "var(--text-dim)" }}>Logged in as {email}</span>
        <button className="btn-danger" onClick={() => sb.auth.signOut()}>Log out</button>
      </div>

      <CategoriesBox />

      <div className="admin-box">
        <h3>{editingId ? "Edit product" : "Add product"}</h3>

        <div className="admin-field">
          <label>Name</label>
          <input type="text" placeholder="Black LV" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Price (USD)</label>
          <input type="number" placeholder="55" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea
            rows="4"
            placeholder="Tell customers about this piece — fabric, fit, details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Category</label>
          <select value={category} onChange={(e) => changeCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
            {/* producto viejo cuya categoría ya no existe: se muestra para no perderla al editar */}
            {category && !bySlug[category] && <option value={category}>{category} (deleted category)</option>}
          </select>
        </div>

        <div className="admin-field">
          <label>Sizes &amp; stock quantity</label>
          <p className="hint" style={{ marginTop: 0, marginBottom: "10px" }}>
            Check the sizes you're offering and type how many you have of each.
          </p>
          <div>
            {sizeRows.map((r) => (
              <div className="size-stock-row" key={r.size}>
                <label>
                  <input type="checkbox" checked={r.checked} onChange={(e) => updateRow(r.size, { checked: e.target.checked })} /> {r.size}
                </label>
                <span></span>
                <input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  value={r.qty}
                  onChange={(e) => updateRow(r.size, { qty: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="admin-field">
          <label>Photos (up to 4) — each can have its own color</label>
          <p className="hint" style={{ marginTop: 0, marginBottom: "10px" }}>
            Photo 1 is required and shows first. If you write a color name for a photo (e.g. "Black", "White"),
            customers can click that color to switch to that exact photo. Leave the color blank for a plain extra
            photo (like a back view) that isn't tied to a color.
          </p>
          {[0, 1, 2, 3].map((i) => (
            <div className="photo-slot" key={`${fileKey}-${i}`}>
              <span className="slot-label">
                Photo {i + 1} {i === 0 ? "(required for new products)" : "(optional)"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0] || null;
                  setFiles((fs) => fs.map((f, j) => (j === i ? file : f)));
                }}
              />
              <input
                type="text"
                placeholder={i === 0 ? "Color (optional), e.g. Black" : i === 1 ? "Color (optional), e.g. White" : "Color (optional)"}
                value={colors[i]}
                onChange={(e) => setColors((cs) => cs.map((c, j) => (j === i ? e.target.value : c)))}
              />
            </div>
          ))}
          {editingId && (
            <p className="hint">
              Editing an existing product? Photos stay the same unless you pick new files above — new files will
              REPLACE all current photos.
            </p>
          )}
        </div>

        <button className="btn-primary" onClick={handleSave}>{editingId ? "Save changes" : "Add product"}</button>
        {editingId && <button className="btn-secondary" onClick={resetForm}>Cancel edit</button>}
        <p className={`admin-msg ${msg.cls}`}>{msg.text}</p>
      </div>

      <div className="admin-box">
        <h3>Current products</h3>
        <div>
          {products === null && "Loading…"}
          {listError && <p className="admin-msg err">{listError}</p>}
          {products && !listError && products.length === 0 && (
            <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>No products yet.</p>
          )}
          {products &&
            products.map((p) => {
              const photos = p.photos || [];
              const thumb = photos[0] ? photos[0].url : p.image_url;
              const colorNames = photos.map((ph) => ph.color).filter(Boolean);
              const st = p.stock || {};
              const stockText = (p.sizes || []).map((s) => `${s}:${st[s] !== undefined ? st[s] : "?"}`).join(", ");
              return (
                <div className="admin-product-row" key={p.id}>
                  <img
                    className="admin-thumb"
                    src={thumb || undefined}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.background = "var(--frame)";
                    }}
                  />
                  <div className="admin-product-info">
                    <h4>{p.name}</h4>
                    <span>
                      ${p.price} USD · {p.category} · Stock: {stockText}
                      {colorNames.length ? " · Colors: " + colorNames.join(", ") : ""}
                    </span>
                  </div>
                  <button className="btn-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* ---------- categorías (crear / editar / borrar, con su foto) ---------- */

function CategoriesBox() {
  const { categories, bySlug, reload } = useCategories();

  const [editingSlug, setEditingSlug] = useState(null); // null = creando una nueva
  const [label, setLabel] = useState("");
  const [sizesText, setSizesText] = useState("S, M, L, XL, XXL");
  const [order, setOrder] = useState("");
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState({ text: "", cls: "" });
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setEditingSlug(null);
    setLabel("");
    setSizesText("S, M, L, XL, XXL");
    setOrder("");
    setFile(null);
    setFileKey((k) => k + 1);
  }

  function startEdit(c) {
    setEditingSlug(c.slug);
    setLabel(c.label);
    setSizesText((c.sizes || []).join(", "));
    setOrder(String(c.sort_order ?? ""));
    setFile(null);
    setFileKey((k) => k + 1);
    setMsg({ text: "", cls: "" });
  }

  async function handleSave() {
    const cleanLabel = label.trim();
    const sizes = parseSizes(sizesText);
    if (!cleanLabel) return setMsg({ text: "Please write the category name.", cls: "err" });
    if (sizes.length === 0) return setMsg({ text: "Please write at least one size, separated by commas.", cls: "err" });

    let slug = editingSlug;
    if (!slug) {
      slug = slugify(cleanLabel);
      if (!slug || slug === "all") return setMsg({ text: "Please use a different name for this category.", cls: "err" });
      if (bySlug[slug]) return setMsg({ text: `A category "${bySlug[slug].label}" already exists.`, cls: "err" });
    }

    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0);
    const sortOrder = Number.isFinite(parseInt(order)) ? parseInt(order) : maxOrder + 1;

    setBusy(true);
    try {
      const payload = { label: cleanLabel, sizes, sort_order: sortOrder };
      if (file) {
        setMsg({ text: "Uploading photo…", cls: "" });
        payload.image_url = await uploadImage(file);
      }
      setMsg({ text: "Saving category…", cls: "" });
      const { error } = editingSlug
        ? await sb.from("categories").update(payload).eq("slug", editingSlug)
        : await sb.from("categories").insert({ slug, ...payload });
      if (error) throw error;
      setMsg({ text: editingSlug ? "Category updated!" : "Category added!", cls: "ok" });
      resetForm();
      reload();
    } catch (err) {
      setMsg({ text: err.message || "Something went wrong.", cls: "err" });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(c) {
    const { count, error: countError } = await sb
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category", c.slug);
    if (countError) return setMsg({ text: countError.message, cls: "err" });
    if (count > 0) {
      return setMsg({
        text: `"${c.label}" still has ${count} product${count === 1 ? "" : "s"}. Move them to another category or delete them first.`,
        cls: "err",
      });
    }
    if (!window.confirm(`Delete the category "${c.label}"?`)) return;
    const { error } = await sb.from("categories").delete().eq("slug", c.slug);
    if (error) return setMsg({ text: error.message, cls: "err" });
    if (editingSlug === c.slug) resetForm();
    setMsg({ text: "Category deleted.", cls: "ok" });
    reload();
  }

  return (
    <div className="admin-box">
      <h3>{editingSlug ? `Edit category: ${bySlug[editingSlug]?.label ?? editingSlug}` : "Categories"}</h3>

      <div className="admin-field">
        <label>Name</label>
        <input type="text" placeholder="Hoodies" value={label} onChange={(e) => setLabel(e.target.value)} />
        {editingSlug && <p className="hint">The web address of this category stays the same: /shop?cat={editingSlug}</p>}
      </div>
      <div className="admin-field">
        <label>Sizes (separated by commas)</label>
        <input type="text" placeholder="S, M, L, XL" value={sizesText} onChange={(e) => setSizesText(e.target.value)} />
        <p className="hint">Changing sizes only affects new products. Existing products keep the sizes they already have.</p>
      </div>
      <div className="admin-field">
        <label>Position in the menu (optional)</label>
        <input type="number" placeholder="Leave blank to put it last" value={order} onChange={(e) => setOrder(e.target.value)} />
      </div>
      <div className="admin-field" key={fileKey}>
        <label>Cover photo (shown on the home page)</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
        <p className="hint">
          Use a light photo (under ~500 KB), it loads on the first screen of the site.
          {editingSlug && " Pick a new file only if you want to replace the current photo."}
        </p>
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={busy}>
        {editingSlug ? "Save category" : "Add category"}
      </button>
      {editingSlug && <button className="btn-secondary" onClick={resetForm}>Cancel edit</button>}
      <p className={`admin-msg ${msg.cls}`}>{msg.text}</p>

      <div style={{ marginTop: "20px" }}>
        {categories.map((c) => (
          <div className="admin-product-row" key={c.slug}>
            <img
              className="admin-thumb"
              src={c.image_url || undefined}
              alt=""
              onError={(e) => {
                e.currentTarget.style.background = "var(--frame)";
              }}
            />
            <div className="admin-product-info">
              <h4>{c.label}</h4>
              <span>/shop?cat={c.slug} · Sizes: {(c.sizes || []).join(", ")}</span>
            </div>
            <button className="btn-edit" onClick={() => startEdit(c)}>Edit</button>
            <button className="btn-danger" onClick={() => handleDelete(c)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}