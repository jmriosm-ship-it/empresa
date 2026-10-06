import { Link } from "react-router-dom";

// Tarjeta de producto, compartida por Shop y por "You might also like".
// `product` debe traer: id, name, price, image.  `index` solo se usa para escalonar la animación.
export default function ProductCard({ product, index = 0, reveal = false }) {
  return (
    <Link
      to={`/product?id=${product.id}`}
      className={`card${reveal ? " reveal" : ""}`}
      style={reveal ? { transitionDelay: `${index * 0.05}s` } : undefined}
    >
      <div className="card-media">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <span className="placeholder">PHOTO COMING SOON</span>
        )}
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="card-price">${product.price} USD</p>
      </div>
    </Link>
  );
}
