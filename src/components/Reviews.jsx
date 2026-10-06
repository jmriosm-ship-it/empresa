import { useEffect, useState } from "react";
import { sb } from "../lib/supabase";

function starString(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [chosenStar, setChosenStar] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState({ text: "", error: false });

  const [version, setVersion] = useState(0); // súbelo para volver a cargar las reseñas
  const load = () => setVersion((v) => v + 1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await sb
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      const {
        data: { session },
      } = await sb.auth.getSession();
      if (cancelled) return;
      setIsAdmin(!!session); // si hay sesión de admin, se muestra el botón de borrar reseñas
      setReviews(error ? [] : data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [productId, version]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this review?")) return;
    await sb.from("reviews").delete().eq("id", id);
    load();
  }

  async function handleSubmit() {
    if (!name.trim() || chosenStar === 0) {
      setMsg({ text: "Please add your name and pick a star rating.", error: true });
      return;
    }
    setMsg({ text: "Submitting…", error: false });

    const { error } = await sb.from("reviews").insert({
      product_id: productId,
      customer_name: name.trim(),
      rating: chosenStar,
      comment: comment.trim(),
    });

    if (error) {
      setMsg({ text: error.message, error: true });
      return;
    }
    setName("");
    setComment("");
    setChosenStar(0);
    setMsg({ text: "", error: false });
    load();
  }

  if (loading) {
    return (
      <div className="reviews-wrap">
        <div className="skeleton" style={{ height: "80px", width: "200px", marginBottom: "20px" }}></div>
        <div className="skeleton" style={{ height: "14px", width: "100%", marginBottom: "10px" }}></div>
        <div className="skeleton" style={{ height: "14px", width: "100%" }}></div>
      </div>
    );
  }

  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => reviews.filter((r) => r.rating === star).length);

  return (
    <div className="reviews-wrap">
      <div className="reviews-head">
        <div className="reviews-score">
          <div className="num">{total ? avg.toFixed(1) : "—"}</div>
          <div className="stars">{starString(avg)}</div>
          <div className="count">{total} review{total === 1 ? "" : "s"}</div>
        </div>
        <div className="reviews-bars">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <div className="rbar-row" key={star}>
              <span style={{ width: "14px" }}>{star}</span>
              <div className="rbar-track">
                <div className="rbar-fill" style={{ width: `${total ? (counts[i] / total) * 100 : 0}%` }}></div>
              </div>
              <span style={{ width: "20px", textAlign: "right" }}>{counts[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        {total === 0 ? (
          <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>No reviews yet — be the first to leave one!</p>
        ) : (
          reviews.map((r) => (
            <div className="review-item" key={r.id}>
              <div className="stars">{starString(r.rating)}</div>
              <div className="who">{r.customer_name}</div>
              <div className="when">{new Date(r.created_at).toLocaleDateString()}</div>
              {r.comment && <div className="comment">{r.comment}</div>}
              {isAdmin && (
                <button className="review-delete-btn" onClick={() => handleDelete(r.id)}>Delete</button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="review-form">
        <h4>Leave a review</h4>
        <div className="star-picker">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className={n <= chosenStar ? "active" : ""} onClick={() => setChosenStar(n)}>★</span>
          ))}
        </div>
        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <textarea rows="3" placeholder="What did you think? (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
        <button className="btn btn-primary" onClick={handleSubmit}>Submit review</button>
        <p className="pi-add-msg" style={{ color: msg.error ? "#c0533e" : "var(--text-dim)" }}>{msg.text}</p>
      </div>
    </div>
  );
}
