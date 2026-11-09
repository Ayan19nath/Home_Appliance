import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import slider1 from "../assets/images/slider1.jpeg";
import slider2 from "../assets/images/slider2.jpeg";
import slider3 from "../assets/images/slider3.jpeg";
import slider4 from "../assets/images/slider4.jpeg";

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeButton, setActiveButton] = useState("");

  const navigate = useNavigate();

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

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % slides.length
      );
    }, 4000);

    return () => clearInterval(slider);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  /* ================= SHOP NOW ================= */

  const handleShopNow = () => {
    setActiveButton("shop");

    setTimeout(() => {
      navigate("/shop");
    }, 150);
  };

  /* ================= EXPLORE PRODUCTS ================= */

  const handleExploreProducts = () => {
    setActiveButton("explore");

    setTimeout(() => {
      navigate("/categories");
    }, 150);
  };

  return (
    <section className="hero">

      <div
        className="hero-image"
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
        }}
      ></div>

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <p className="hero-small">
          {slides[currentSlide].small}
        </p>

        <h1>
          {slides[currentSlide].title1}
          <br />
          {slides[currentSlide].title2}
          <br />
          <span>
            {slides[currentSlide].title3}
          </span>
        </h1>

        <p className="hero-description">
          {slides[currentSlide].description}
          <br />
          {slides[currentSlide].description2}
        </p>

        {/* ================= BUTTONS ================= */}

        <div className="hero-buttons">

          {/* SHOP NOW */}

          <button
            type="button"
            className={`shop-btn ${
              activeButton === "shop"
                ? "hero-btn-active"
                : ""
            }`}
            onClick={handleShopNow}
          >
            Shop Now
            <span>→</span>
          </button>


          {/* EXPLORE PRODUCTS */}

          <button
            type="button"
            className={`explore-btn ${
              activeButton === "explore"
                ? "hero-btn-active"
                : ""
            }`}
            onClick={handleExploreProducts}
          >
            <b>Explore Products</b>
             <span> →</span>
          </button>

        </div>

      </div>


      {/* ================= SLIDER DOTS ================= */}

      <div className="hero-dots">

        {slides.map((_, index) => (

          <span
            key={index}
            className={`dot ${
              currentSlide === index
                ? "active-dot"
                : ""
            }`}
            onClick={() =>
              goToSlide(index)
            }
          ></span>

        ))}

      </div>

    </section>
  );
}

export default HeroSection;