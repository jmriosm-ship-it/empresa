import { Navigate, useLocation } from "react-router-dom";

/*
  Redirige las direcciones de la web vieja (product.html?id=..., shop.html?cat=...) a las nuevas.
  Conserva lo que va después del "?" para que no se pierda el producto ni la categoría.
*/
export default function LegacyRedirect({ to }) {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: to, search, hash }} replace />;
}
