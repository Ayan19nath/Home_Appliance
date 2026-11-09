import { useRef } from "react";
import { Users, PackageCheck, ShieldCheck, Headphones, Truck, Heart, Play } from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";
import AboutHero from "../assets/images/slider1.jpeg";
import AboutStoryVideo from "../assets/videos/about-story.mp4";

/* ===== STATS DATA ===== */
const stats = [
  { Icon: Users, num: "10K+", label: "Happy Customers" },
  { Icon: PackageCheck, num: "500+", label: "Products" },
  { Icon: ShieldCheck, num: "5+", label: "Years of Trust" },
];

/* ===== VALUES DATA ===== */
const values = [
  { Icon: ShieldCheck, title: "Quality Products", text: "Only the best for you", to: "/shop" },
  { Icon: Headphones, title: "Great Support", text: "We're always here to help", to: "/faq" },
  { Icon: Truck, title: "Fast Delivery", text: "On time, every time", to: "/terms-conditions" },
  { Icon: Heart, title: "Customer First", text: "Your satisfaction is our priority", to: "/contact" },
];

function About() {
  const videoRef = useRef(null);

  return (
    <main className="about-page">
      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1>About Us</h1>
            <h2>Better Home. Better Life</h2>
            <div className="about-breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <strong>About Us</strong>
            </div>
          </div>
          <div className="about-hero-image">
            <img src={AboutHero} alt="Home Appliances" />
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="about-story">
        <div className="about-story-content">
          <div className="about-story-text">
            <span className="about-small-title">OUR STORY</span>
            <h2>
              Bringing Comfort to
              <br />
              Every Home
            </h2>
            <p>
              <strong>HomeHub</strong> is your trusted partner in home appliances. We started with a
              simple mission — to make everyday life easier, more comfortable and more modern.
            </p>
            <p>
              With a wide range of high-quality products, competitive prices and excellent customer
              service, we are committed to bringing the best home solutions to every household.
            </p>

            {/* ===== STATS ===== */}
            <div className="about-stats">
              {stats.map(({ Icon, num, label }) => (
                <div className="about-stat" key={label}>
                  <Icon size={38} />
                  <div>
                    <strong>{num}</strong>
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== STORY VIDEO ===== */}
          <div className="about-story-image">
            <video ref={videoRef} src={AboutStoryVideo} playsInline preload="metadata" />
            <button
              type="button"
              className="about-play-button"
              aria-label="Play video"
              onClick={() => videoRef.current?.play()}
            >
              <Play size={32} fill="currentColor" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== OUR VALUES (hover pop-up cards) ===== */}
      <section className="about-values">
        <div className="about-section-heading">
          <h2>Our Values</h2>
        </div>
        <div className="about-values-grid">
          {values.map(({ Icon, title, text, to }) => (
            <Link to={to} className="about-value-card" key={title}>
              <Icon size={42} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default About;