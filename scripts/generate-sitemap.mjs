// Genera public/sitemap.xml y public/robots.txt antes de cada build.
// Lee los productos de Supabase; si falla la consulta, igual escribe el sitemap con las páginas fijas
// (el build nunca se rompe por esto).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://synkdstreetwear.store";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const urls = [];
const addStatic = (p) => urls.push({ loc: SITE + p });

try {
  const { sb } = await import("../src/lib/supabase.js");

  // categorías desde Supabase (si falla o no existe la tabla, se usan las 3 de siempre)
  let slugs = ["tshirts", "shorts", "alo"];
  const cats = await sb.from("categories").select("slug").order("sort_order");
  if (!cats.error && cats.data) slugs = cats.data.map((c) => c.slug);
  ["/", "/shop", ...slugs.map((sl) => `/shop?cat=${sl}`), "/contact", "/policies"].forEach(addStatic);
  const { data, error } = await sb.from("products").select("id, created_at");
  if (error) throw error;
  for (const p of data || []) {
    urls.push({
      loc: `${SITE}/product?id=${p.id}`,
      lastmod: p.created_at ? new Date(p.created_at).toISOString().slice(0, 10) : undefined,
    });
  }
  console.log(`[sitemap] ${data?.length ?? 0} productos incluidos`);
} catch (e) {
  console.warn("[sitemap] No se pudo leer Supabase, se genera solo con páginas fijas:", e?.message || e);
  if (urls.length === 0) {
    ["/", "/shop", "/shop?cat=tshirts", "/shop?cat=shorts", "/shop?cat=alo", "/contact", "/policies"].forEach(addStatic);
  }
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
    .join("\n") +
  `\n</urlset>\n`;

mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, "sitemap.xml"), xml);
writeFileSync(resolve(publicDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`[sitemap] public/sitemap.xml generado con ${urls.length} URLs`);