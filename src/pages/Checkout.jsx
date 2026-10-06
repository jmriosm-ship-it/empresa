import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { lineKey } from "../utils/cartLine";
import { STORE_WHATSAPP } from "../constants";

const EMPTY_FORM = { fname: "", lname: "", email: "", phone: "", address: "", city: "", state: "", zip: "" };

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  // actualiza un campo del formulario: onChange={set("fname")}
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    if (cart.length === 0) return;

    const itemsText = cart
      .map((i) => {
        const extras = [i.color && `Color: ${i.color}`, `Size: ${i.size || "—"}`].filter(Boolean).join(" | ");
        return `- ${i.qty}x ${i.name} | ${extras} ($${i.price} each)`;
      })
      .join("\n");

    const message =
      `New order from SYNKD site\n\n` +
      `Customer: ${form.fname} ${form.lname}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Shipping to: ${form.address}, ${form.city}, ${form.state} ${form.zip}\n\n` +
      `Items:\n${itemsText}\n\n` +
      `Total: $${cartTotal.toFixed(2)} USD`;

    window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
    setSent(true);
  }

  return (
    <>
      <div className="section-head" style={{ paddingBottom: 0 }}>
        <div>
          <div className="meta"><span>SECURE</span></div>
          <h2>CHECKOUT</h2>
        </div>
      </div>

      <div className="checkout-wrap">
        {sent ? (
          <div className="empty-state">
            <h3>Order sent ✓</h3>
            <p>We opened WhatsApp with your order details. Confirm payment there to finish.</p>
            <br />
            <Link to="/" className="btn btn-primary">Back to home</Link>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <Link to="/shop" className="btn btn-primary">Go to shop</Link>
          </div>
        ) : (
          <>
            <div>
              {cart.map((i) => (
                <div className="order-line" key={lineKey(i)}>
                  <span>
                    {i.qty} × {i.name}
                    {i.color ? ` (${i.color})` : ""}
                    {i.size ? ` (Size ${i.size})` : ""}
                  </span>
                  <span>${(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
              <div
                className="order-line"
                style={{ color: "var(--text)", fontWeight: 700, borderTop: "1px solid var(--line)", marginTop: "8px", paddingTop: "12px" }}
              >
                <span>Total</span>
                <span>${cartTotal.toFixed(2)} USD</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: "26px" }}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">First name</label>
                  <input id="fname" required value={form.fname} onChange={set("fname")} />
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last name</label>
                  <input id="lname" required value={form.lname} onChange={set("lname")} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" required value={form.email} onChange={set("email")} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" required value={form.phone} onChange={set("phone")} />
              </div>
              <div className="form-group">
                <label htmlFor="address">Shipping address</label>
                <input id="address" required value={form.address} onChange={set("address")} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input id="city" required value={form.city} onChange={set("city")} />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input id="state" required value={form.state} onChange={set("state")} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP code</label>
                <input id="zip" required value={form.zip} onChange={set("zip")} />
              </div>

              <button type="submit" className="btn btn-primary btn-full">Pay now</button>
              <p className="small-note">
                Card payment via Stripe is being connected. For now, submitting sends your order
                and address straight to SYNKD on WhatsApp to confirm payment.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  );
}
