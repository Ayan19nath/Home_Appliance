import { useState } from "react";
import { Phone, Mail, MapPin, Clock, User, MessageSquare, Send, ChevronDown, Truck, ShieldCheck, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import "./Contact.css";
import ContactHero from "../assets/images/slider2.jpeg";

/* ===== INFO CARDS DATA ===== */
const info = [
  { Icon: Phone, title: "Phone", lines: ["+91 8100443637"], note: "Mon - Sat, 9:00 AM - 7:00 PM", href: "tel:+918100443637" },
  { Icon: Mail, title: "Email", lines: ["homehub2026official@gmail.com"], note: "We reply within 24 hours", href: "mailto:homehub2026official@gmail.com" },
  { Icon: MapPin, title: "Our Address", lines: ["Hazra, Kalighat", "Kolkata, West Bengal - 700026"], note: "India", ext: true,
    href: "https://www.google.com/maps/search/?api=1&query=Hazra+Kalighat,+Kolkata,+West+Bengal+700026" },
  { Icon: Clock, title: "Working Hours", lines: ["Monday - Saturday", "9:00 AM - 7:00 PM"], note: "Sunday - Closed" },
];

/* ===== SERVICE ITEMS DATA ===== */
const services = [
  { Icon: Truck, title: "Free Shipping", text: "On all orders", to: "/terms-conditions" },
  { Icon: ShieldCheck, title: "Easy Returns", text: "Within 7 days", to: "/return-policy" },
  { Icon: ShieldCheck, title: "Secure Payment", text: "100% secure" },
  { Icon: Headphones, title: "24/7 Support", text: "We're here to help", to: "/contact" },
];

/* ===== FORM DATA ===== */
const fields = [
  { name: "name", type: "text", ph: "Your Name", Icon: User },
  { name: "email", type: "email", ph: "Your Email", Icon: Mail },
  { name: "phone", type: "tel", ph: "Phone Number", Icon: Phone },
];
const subjects = ["Order Support", "Product Information", "Return & Refund", "Payment Issue", "Other"];
const empty = { name: "", email: "", phone: "", subject: "", message: "" };

function Contact() {
  const [form, setForm] = useState(empty);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) return alert("Please fill in all fields.");
    alert("Your message has been sent successfully!");
    setForm(empty);
  };

  return (
    <main className="contact-page">
      {/* ===== HERO ===== */}
      <section className="contact-hero">
        <div className="contact-hero-overlay">
          <div className="contact-hero-content">
            <span className="contact-hero-label">GET IN TOUCH</span>
            <h1>
              We’re Here to
              <br />
              <span>Help You</span>
            </h1>
            <p>
              Have a question, suggestion or need assistance?
              <br />
              Feel free to reach out — we’d love to hear from you.
            </p>
          </div>
          <div className="contact-hero-image">
            <img src={ContactHero} alt="Home Appliances" />
          </div>
        </div>
      </section>

      <section className="contact-main">
        {/* ===== LEFT: CONTACT INFO ===== */}
        <div className="contact-information">
          <div className="contact-heading">
            <h2>Contact Information</h2>
            <p>Reach us through any of the following channels.</p>
          </div>

          {/* info cards (hover pop-up) */}
          <div className="contact-info-grid">
            {info.map(({ Icon, title, lines, note, href, ext }) => {
              const Tag = href ? "a" : "div";
              return (
                <Tag
                  key={title}
                  className="contact-info-card"
                  href={href}
                  {...(ext && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <div className="contact-icon">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    {lines.map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                    <span>{note}</span>
                  </div>
                </Tag>
              );
            })}
          </div>

          {/* service items (hover pop-up) */}
          <div className="contact-services">
            {services.map(({ Icon, title, text, to }) => {
              const Tag = to ? Link : "div";
              return (
                <Tag key={title} to={to} className="contact-service-item">
                  <Icon size={35} />
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>

        {/* ===== RIGHT: FORM ===== */}
        <div className="contact-form-wrapper">
          <div className="contact-form-heading">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we’ll get back to you as soon as possible.</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {fields.map(({ name, type, ph, Icon }) => (
              <div className="contact-input-group" key={name}>
                <Icon size={20} />
                <input type={type} name={name} placeholder={ph} value={form[name]} onChange={handleChange} />
              </div>
            ))}

            <div className="contact-input-group">
              <MessageSquare size={20} />
              <select name="subject" value={form.subject} onChange={handleChange}>
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-arrow" size={18} />
            </div>

            <div className="contact-textarea-group">
              <MessageSquare size={20} />
              <textarea name="message" placeholder="Your Message" value={form.message} onChange={handleChange} rows="5" />
            </div>

            <button type="submit" className="contact-submit-btn">
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;