import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <div className="section-head" style={{ paddingBottom: 0 }}>
        <div>
          <div className="meta"><span>GET IN TOUCH</span></div>
          <h2>CONTACT US</h2>
        </div>
      </div>

      <section className="contact-list" style={{ paddingTop: "30px" }}>
        <div className="contact-row">
          <span className="contact-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <a href="https://wa.me/15513128280" target="_blank" rel="noopener noreferrer">WhatsApp · 551 312-8280</a>
        </div>
        <div className="contact-row">
          <span className="contact-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
            </svg>
          </span>
          <a href="https://instagram.com/synkd.streetwear" target="_blank" rel="noopener noreferrer">@synkd.streetwear</a>
        </div>
        <div className="contact-row">
          <span className="contact-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <a href="sms:+15512865474">Text · 551 286-5474</a>
        </div>
      </section>

      <Footer />
    </>
  );
}
