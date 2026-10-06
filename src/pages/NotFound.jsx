import { Link } from "react-router-dom";

// Nueva: en la web vieja un link roto daba el 404 del hosting; en React hay que tener esta ruta "comodín".
export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: "100px 24px" }}>
      <h3>Page not found</h3>
      <p>The page you're looking for doesn't exist.</p>
      <br />
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
