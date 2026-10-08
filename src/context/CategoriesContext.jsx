import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { sb } from "../lib/supabase";
import { DEFAULT_CATEGORIES } from "../constants";

const CategoriesContext = createContext(null);

// Carga las categorías una sola vez y las comparte con Header, Home, Shop, SEO y Admin.
// Si la consulta falla (tabla sin crear, sin internet…), se queda con DEFAULT_CATEGORIES: la tienda nunca queda vacía.
export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loaded, setLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (!error && data) setCategories(data);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [version]);

  const value = useMemo(() => {
    const bySlug = {};
    categories.forEach((c) => {
      bySlug[c.slug] = c;
    });
    return { categories, bySlug, loaded, reload };
  }, [categories, loaded, reload]);

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories debe usarse dentro de <CategoriesProvider>");
  return ctx;
}