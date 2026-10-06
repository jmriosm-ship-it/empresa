import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const POLICIES = [
  "100% payment in advance to process the purchase (card, Zelle, CashApp, etc.).",
  "Processing: 2 to 5 business days. Shipping: 3 to 7 business days, depending on location.",
  "Returns accepted only for manufacturing defects (size exchanges not applicable; within 3 days of receiving the order).",
];

export default function Policies() {
  return (
    <>
      <div className="section-head" style={{ paddingBottom: 0 }}>
        <div>
          <h2>PURCHASING<br />POLICIES</h2>
        </div>
      </div>

      <div className="policy-list" style={{ paddingTop: "30px" }}>
        {POLICIES.map((text, i) => (
          <div className="policy-item" key={i}>
            <div className="policy-num">{i + 1}</div>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <Footer title={<>Ready to place<br />your order?</>}>
        <Link to="/shop" style={{ textDecoration: "underline" }}>Go to the shop →</Link>
      </Footer>
    </>
  );
}
