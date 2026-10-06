export default function Footer({ title = <>@SYNKD.<br />STREETWEAR</>, children }) {
  return (
    <footer className="footer-panel">
      <div className="handle">{title}</div>
      <p>{children || "You are just one step away from holding the product you've always dreamed of in your hands."}</p>
    </footer>
  );
}