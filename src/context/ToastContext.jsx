import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

/* Notificación flotante (reemplaza showToast() de js/main.js). Uso: const { showToast } = useToast(); */

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback((message) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, message, show: false }]);

    // doble requestAnimationFrame para que la transición CSS de entrada sí se dispare
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, show: true } : x))))
    );

    setTimeout(() => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, show: false } : x)));
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 300);
    }, 2400);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div id="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.show ? "show" : ""}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
