import { useEffect } from "react";

export const SITE = "https://synkdstreetwear.store";
const DEFAULT_IMAGE = `${SITE}/assets/logo.png`;

function upsert(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

export function applySeo({ title, description, path = "/", image = DEFAULT_IMAGE, noindex = false }) {
  const url = SITE + path;
  document.title = title;
  upsert('meta[name="description"]', "meta", { name: "description", content: description });
  upsert('link[rel="canonical"]', "link", { rel: "canonical", href: url });
  upsert('meta[property="og:title"]', "meta", { property: "og:title", content: title });
  upsert('meta[property="og:description"]', "meta", { property: "og:description", content: description });
  upsert('meta[property="og:url"]', "meta", { property: "og:url", content: url });
  upsert('meta[property="og:image"]', "meta", { property: "og:image", content: image });

  const robots = document.head.querySelector('meta[name="robots"]');
  if (noindex) {
    upsert('meta[name="robots"]', "meta", { name: "robots", content: "noindex, nofollow" });
  } else if (robots) {
    robots.remove();
  }
}

export default function useSeo(opts) {
  const { title, description, path, image, noindex, skip } = opts;
  useEffect(() => {
    if (skip) return;
    applySeo({ title, description, path, image, noindex });
  }, [title, description, path, image, noindex, skip]);
}