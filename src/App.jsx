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

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin"); // el admin trae su propio header (solo el logo)

  return (
    <CartProvider>
      <ToastProvider>
        <CursorBackground />
        <ScrollToTop />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </CartProvider>
  );
}

export default App;
