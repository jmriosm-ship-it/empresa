import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { lineKey } from "../utils/cartLine";

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();

  return (
    <>
      <div className="section-head" style={{ paddingBottom: 0 }}>
        <div>
          <div className="meta"><span>YOUR</span></div>
          <h2>CART</h2>
        </div>
      </div>

      <div className="cart-wrap">
        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add something from the shop first.</p>
            <br />
            <Link to="/shop" className="btn btn-primary">Go to shop</Link>
          </div>
        ) : (
          <>
            {cart.map((item) => {
              const key = lineKey(item);
              return (
                <div className="cart-item" key={key}>
                  <div className="cart-thumb">
                    {item.image && (
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px" }} />
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span>
                      {item.color ? `Color: ${item.color} · ` : ""}
                      {item.size ? `Size: ${item.size} · ` : ""}${item.price} USD
                    </span>
                    <div className="qty-control" style={{ marginTop: "8px" }}>
                      <button onClick={() => updateQty(key, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(key, item.qty + 1)}>+</button>
                    </div>
                    <a className="remove-btn" onClick={() => removeFromCart(key)}>Remove</a>
                  </div>
                  <div style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</div>
                </div>
              );
            })}

            <div className="cart-summary">
              <div className="cart-summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)} USD</span></div>
              <div className="cart-summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
              <div className="cart-summary-row total"><span>Total</span><span>${cartTotal.toFixed(2)} USD</span></div>
              <Link to="/checkout" className="btn btn-primary btn-full" style={{ marginTop: "16px" }}>Checkout</Link>
              <Link to="/shop" className="btn btn-outline btn-full">Continue shopping</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
