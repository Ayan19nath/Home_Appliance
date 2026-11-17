import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import slider1 from "../assets/images/slider1.jpeg";
import slider2 from "../assets/images/slider2.jpeg";
import slider3 from "../assets/images/slider3.jpeg";
import slider4 from "../assets/images/slider4.jpeg";

// The four slides (outside the component, so they are created only once)
const slides = [
  {
    image: slider1,
    small: "PREMIUM HOME APPLIANCES",
    title1: "Upgrade Your",
    title2: "Home, Upgrade",
    title3: "Your Life",
    description: "Premium Home Appliances for a",
    description2: "Smarter, Easier and Better Tomorrow.",
  },
  {
    image: slider2,
    small: "SMART LIVING, BETTER LIFE",
    title1: "Make Your",
    title2: "Home More",
    title3: "Smart",
    description: "Modern Appliances for a",
    description2: "Smarter and Comfortable Lifestyle.",
  },
  {
    image: slider3,
    small: "QUALITY HOME APPLIANCES",
    title1: "Upgrade Your",
    title2: "Lifestyle With",
    title3: "HomeHub",
    description: "Reliable Appliances for a",
    description2: "Better, Easier and Happier Home.",
  },
  {
    image: slider4,
    small: "INNOVATIVE SOLUTIONS",
    title1: "Experience The",
    title2: "Future Of",
    title3: "Home Living",
    description: "Cutting-edge Appliances for a",
    description2: "More Efficient and Enjoyable Home.",
  },
];

// True on computers (a touch screen has no real "mouse over")
const canHover = typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeButton, setActiveButton] = useState("");
  const [moved, setMoved] = useState(0);     // counts moves by hand, so the timer starts again after each one
  const [hover, setHover] = useState(false); // the slider waits while the mouse is on it
  const touchX = useRef(null);
  const navigate = useNavigate();

  // Next slide every 4 seconds
  useEffect(() => {
    if (hover) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [moved, hover]);

  // Go to a slide by hand (arrows, dots or swipe); it loops around
  const goTo = (index) => {
    setCurrentSlide((index + slides.length) % slides.length);
    setMoved((count) => count + 1);
  };

  // Swipe with the finger: left = next slide, right = previous slide
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const distance = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(distance) > 50) goTo(currentSlide + (distance < 0 ? 1 : -1));
  };

  // Hero buttons: a short click effect, then open the page
  const open = (path, name) => {
    setActiveButton(name);
    setTimeout(() => navigate(path), 150);
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="hero"
      onMouseEnter={() => canHover && setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      {/* picture and text start again (with a soft fade) for every slide */}
      <div key={`image-${currentSlide}`} className="hero-image hero-fade" style={{ backgroundImage: `url(${slide.image})` }}></div>

      <div className="hero-overlay"></div>

      <div key={`text-${currentSlide}`} className="hero-content hero-rise">
        <p className="hero-small">{slide.small}</p>

        <h1>
          {slide.title1}
          <br />
          {slide.title2}
          <br />
          <span>{slide.title3}</span>
        </h1>

        <p className="hero-description">
          {slide.description}
          <br />
          {slide.description2}
        </p>

        {/* ================= BUTTONS ================= */}
        <div className="hero-buttons">
          <button
            type="button"
            className={`shop-btn ${activeButton === "shop" ? "hero-btn-active" : ""}`}
            onClick={() => open("/shop", "shop")}
          >
            Shop Now
            <span>→</span>
          </button>

          <button
            type="button"
            className={`explore-btn ${activeButton === "explore" ? "hero-btn-active" : ""}`}
            onClick={() => open("/categories", "explore")}
          >
            <b>Explore Products</b>
            <span> →</span>
          </button>
        </div>
      </div>

      {/* ================= ARROWS ================= */}
      <button type="button" className="hero-arrow hero-prev" onClick={() => goTo(currentSlide - 1)} aria-label="Previous slide">
        <ChevronLeft size={26} />
      </button>
      <button type="button" className="hero-arrow hero-next" onClick={() => goTo(currentSlide + 1)} aria-label="Next slide">
        <ChevronRight size={26} />
      </button>

      {/* ================= SLIDER DOTS ================= */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? "active-dot" : ""}`}
            onClick={() => goTo(index)}
            role="button"
            aria-label={`Go to slide ${index + 1}`}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default HeroSection;