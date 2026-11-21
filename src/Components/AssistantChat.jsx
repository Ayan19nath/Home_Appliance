import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, ShoppingCart, Eye } from "lucide-react";
import api from "../api";
import { useCart } from "../Context/CartContext";
import { stockInfo } from "../data/stock";
import "./AssistantChat.css";

const SUGGESTIONS = ["Best AC under ₹40,000", "Suggest a fridge for a family of 4", "Which products have a discount?"];
const HIDDEN = /^\/(checkout|admin)/; // the chat bubble is not shown on these pages
const money = (n) => Number(n || 0).toLocaleString("en-IN");

export default function AssistantChat() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { addProductToCart } = useCart();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", text, products?, error? }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({}); // small message under a product card: { productId: text }
  const bottom = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  if (HIDDEN.test(pathname)) return null;

  // The product page the customer is looking at (the assistant knows about it)
  const productId = pathname.match(/^\/product\/([a-f0-9]{24})$/)?.[1];

  // Send a question to the server
  const send = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    const history = [...messages.filter((m) => !m.error), { role: "user", text: question }];
    setMessages([...messages, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/assistant", {
        messages: history.slice(-10).map(({ role, text }) => ({ role, text })),
        productId,
      });
      setMessages((m) => [...m, { role: "assistant", text: data.reply, products: data.products }]);
    } catch (err) {
      const message = err.response?.data?.message || "The assistant is unavailable right now. Please try again later.";
      setMessages((m) => [...m, { role: "assistant", text: message, error: true }]);
    }
    setLoading(false);
  };

  // Add a product card's product to the cart (the cart keeps the stock limit)
  const addToCart = (p) => {
    const problem = addProductToCart(p);
    setNotes((n) => ({ ...n, [p.id]: problem || "Added to cart ✓" }));
    setTimeout(() => setNotes((n) => ({ ...n, [p.id]: "" })), 2500);
  };

  // Open the product page (on a phone the chat closes, so the page is visible)
  const view = (p) => {
    navigate(`/product/${p.id}`);
    if (window.innerWidth < 600) setOpen(false);
  };

  return (
    <>
      {open && (
        <section className="ai-panel" aria-label="HomeHub assistant">

          {/* HEADER */}
          <header className="ai-header">
            <Sparkles size={20} />
            <div>
              <strong>HomeHub Assistant</strong>
              <span>Ask about products, prices and stock</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
          </header>

          {/* MESSAGES */}
          <div className="ai-messages">
            <div className="ai-bubble bot">Hi! I can help you find and compare products. What are you looking for?</div>

            {messages.length === 0 && (
              <div className="ai-suggestions">
                {SUGGESTIONS.map((s) => <button type="button" key={s} onClick={() => send(s)}>{s}</button>)}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`ai-row ${m.role}`}>
                <div className={`ai-bubble ${m.role === "user" ? "me" : "bot"}${m.error ? " error" : ""}`}>{m.text}</div>

                {/* PRODUCT CARDS */}
                {m.products?.map((p) => {
                  const [stockText, stockColor] = stockInfo(p.stock);
                  return (
                    <div className="ai-card" key={p.id}>
                      <img src={p.image} alt={p.name} />
                      <div className="ai-card-info">
                        <strong>{p.name}</strong>
                        <span>{p.brand}</span>
                        <div className="ai-card-price">
                          ₹{money(p.price)}
                          {p.oldPrice > p.price && <del>₹{money(p.oldPrice)}</del>}
                        </div>
                        <small style={{ color: stockColor }}>{stockText}</small>
                        <div className="ai-card-actions">
                          <button type="button" onClick={() => view(p)}><Eye size={14} /> View</button>
                          <button type="button" disabled={p.stock <= 0} onClick={() => addToCart(p)}><ShoppingCart size={14} /> Add</button>
                        </div>
                        {notes[p.id] && <em>{notes[p.id]}</em>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {loading && <div className="ai-bubble bot ai-typing"><span /><span /><span /></div>}
            <div ref={bottom} />
          </div>

          {/* INPUT */}
          <form className="ai-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask about a product..."
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send"><Send size={18} /></button>
          </form>
          <p className="ai-note">AI answers can be wrong. Please don't share personal details.</p>
        </section>
      )}

      {/* FLOATING BUTTON */}
      <button type="button" className="ai-fab" onClick={() => setOpen(!open)} aria-label="Open the shopping assistant">
        {open ? <X size={26} /> : <MessageCircle size={28} />}
      </button>
    </>
  );
}