import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Header from "./components/Header";
import CursorBackground from "./components/CursorBackground";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import LegacyRedirect from "./components/LegacyRedirect";
import RouteSeo from "./components/RouteSeo";

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin"); // el admin trae su propio header (solo el logo)

  return (
    <CartProvider>
      <ToastProvider>
        <CursorBackground />
        <ScrollToTop />
        <RouteSeo/>
        {!isAdmin && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/admin" element={<Admin />} />
          {/* Direcciones de la web vieja (HTML) -> direcciones nuevas */}
          <Route path="/index.html" element={<LegacyRedirect to="/" />} />
          <Route path="/shop.html" element={<LegacyRedirect to="/shop" />} />
          <Route path="/product.html" element={<LegacyRedirect to="/product" />} />
          <Route path="/cart.html" element={<LegacyRedirect to="/cart" />} />
          <Route path="/checkout.html" element={<LegacyRedirect to="/checkout" />} />
          <Route path="/contact.html" element={<LegacyRedirect to="/contact" />} />
          <Route path="/policies.html" element={<LegacyRedirect to="/policies" />} />
          <Route path="/admin.html" element={<LegacyRedirect to="/admin" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;
