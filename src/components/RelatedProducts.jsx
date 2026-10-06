import { useEffect, useRef, useState } from "react";
import { sb } from "../lib/supabase";
import ProductCard from "./ProductCard";
import useDragScroll from "../hooks/useDragScroll";

// Se separa en un componente propio para que el ref exista justo cuando la fila ya se pintó
function DragRow({ children }) {
  const ref = useRef(null);
  useDragScroll(ref);
  return <div className="related-grid" ref={ref}>{children}</div>;
}

export default function RelatedProducts({ category, excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", excludeId)
        .limit(6);
      if (cancelled || error || !data) return;
      setItems(data.map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image_url })));
    })();
    return () => {
      cancelled = true;
    };
  }, [category, excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="related-wrap">
      <h3 className="related-title">You might also like</h3>
      <DragRow>
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </DragRow>
    </div>
  );
}
