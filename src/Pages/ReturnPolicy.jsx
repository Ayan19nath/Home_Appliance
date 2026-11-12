import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";

// Policy sections: [title, lines of text]. Edit the times and rules to match your business.
const sections = [
  ["Return Window", ["You can request a return within 7 days of delivery if the product is defective, damaged in transit, or different from what you ordered."]],
  ["Conditions", [
    "The product must be unused and in its original packaging with all accessories, manuals and invoice.",
    "Products with physical damage caused after delivery, or installed by someone other than an authorised technician, cannot be returned.",
  ]],
  ["How to Request a Return", [
    "Open My Orders, choose the order and contact us with your order ID, photos of the product and the reason.",
    "Our team will confirm the request and arrange a pickup.",
  ]],
  ["Refunds", [
    "After the returned product is checked, the refund is sent to the original payment method within 5 to 7 working days.",
    "For Cash on Delivery orders, the refund is sent to the bank account or UPI you give us.",
  ]],
  ["Order Cancellation", ["You can cancel an order from My Orders before it is shipped. Paid orders that are cancelled are refunded to the original payment method."]],
];

const style = {
  page: { minHeight: "100vh", background: "#f4fbff", padding: "40px 16px" },
  card: { maxWidth: 860, margin: "0 auto", background: "#fff", border: "1px solid #d7edf7", borderRadius: 12, padding: "32px 28px", boxShadow: "0 3px 12px rgba(0,75,120,0.06)" },
  head: { display: "flex", alignItems: "center", gap: 14, marginBottom: 6, color: "#087ee8" },
  title: { margin: 0, color: "#12395c", fontSize: 32 },
  intro: { margin: "6px 0 26px", color: "#58728a", fontSize: 15, lineHeight: 1.6 },
  h2: { margin: "24px 0 8px", color: "#12395c", fontSize: 19 },
  p: { margin: "0 0 8px", color: "#536b7d", fontSize: 15, lineHeight: 1.7 },
  link: { color: "#087ee8", fontWeight: 600, textDecoration: "none" },
};

function ReturnPolicy() {
  return (
    <main style={style.page}>
      <section style={style.card}>
        <div style={style.head}>
          <RotateCcw size={30} />
          <h1 style={style.title}>Return Policy</h1>
        </div>
        <p style={style.intro}>We want you to be happy with every HomeHub purchase. Here is how returns and refunds work.</p>

        {sections.map(([title, lines]) => (
          <div key={title}>
            <h2 style={style.h2}>{title}</h2>
            {lines.map((line) => <p style={style.p} key={line}>{line}</p>)}
          </div>
        ))}

        <h2 style={style.h2}>Need Help?</h2>
        <p style={style.p}>
          Questions about a return? <Link to="/contact" style={style.link}>Contact us</Link> and we will help you.
        </p>
        <p style={{ ...style.p, fontSize: 13, color: "#80919d", marginTop: 20 }}>Last updated: November 2026</p>
      </section>
    </main>
  );
}

export default ReturnPolicy;