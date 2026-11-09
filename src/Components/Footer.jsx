import { Link } from "react-router-dom";

import logo from "../assets/logo.jpeg";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* Footer Logo */}
        
        <Link
          to="/"
          className="logo"
        >
          <svg
            className="homehub-logo"
            viewBox="0 0 260 70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fill="none"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 30 L38 7 L68 30" />
              <path d="M16 25 V57 H60 V25" />
              <path d="M51 18 V7 H60 V25" />
            </g>

            <g fill="white">
              <rect
                x="29"
                y="31"
                width="9"
                height="9"
                rx="2"
              />

              <rect
                x="41"
                y="31"
                width="9"
                height="9"
                rx="2"
              />

              <rect
                x="29"
                y="43"
                width="9"
                height="9"
                rx="2"
              />

              <rect
                x="41"
                y="43"
                width="9"
                height="9"
                rx="2"
              />
            </g>

            <path
              d="M5 49 C25 68, 65 69, 78 45"
              fill="none"
              stroke="#ff9d00"
              strokeWidth="7"
              strokeLinecap="round"
            />

            <text
              x="82"
              y="43"
              fill="white"
              fontSize="35"
              fontWeight="700"
              fontFamily="Arial, Helvetica, sans-serif"
            >
              Home
            </text>

            <text
              x="178"
              y="43"
              fill="#ff9d00"
              fontSize="35"
              fontWeight="700"
              fontFamily="Arial, Helvetica, sans-serif"
            >
              Hub
            </text>

            <text
              x="115"
              y="59"
              fill="white"
              fontSize="10"
              fontWeight="600"
              fontFamily="Arial, Helvetica, sans-serif"
              letterSpacing="1"
            >
              YOUR HOME, OUR APPLIANCES
              
            </text>
           
          </svg>
        </Link>

        {/* Quick Links */}
        <div>
          <h4>Quick Links</h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/categories">
            Categories
          </Link>
        </div>

        {/* Customer Support */}
        <div>
          <h4>Customer Support</h4>

          <Link to="/contact">
            Contact Us
          </Link>

          <Link to="/order-tracking">
            Order Tracking
          </Link>

          <Link to="/faq">
            FAQ
          </Link>
        </div>

        {/* Policies */}
        <div>
          <h4>Policies</h4>

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <Link to="/terms-conditions">
            Terms & Conditions
          </Link>

          <Link to="/return-policy">
            Return Policy
          </Link>
        </div>

      </div>

      {/* Social Media */}
      <div className="footer-social">

        {/* Instagram */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="5"
            />

            <circle
              cx="12"
              cy="12"
              r="4"
            />

            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.67.33-1 1-1z" />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          title="YouTube"
        >
          <svg
            width="22"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
          </svg>
        </a>

        {/* Twitter / X */}
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          title="Twitter"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2zm-1.1 17.6h1.73L8.28 4.28H6.42L17.8 19.6z" />
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.38-3.37-1.38-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.59 2.35 1.13 2.92.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.06A9.2 9.2 0 0 1 12 6.08c.85 0 1.7.12 2.5.36 1.91-1.34 2.75-1.06 2.75-1.06.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.77 0 3.96-2.34 4.83-4.57 5.09.36.32.68.94.68 1.9v2.83c0 .27.18.59.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
          </svg>
        </a>

      </div>

      {/* Copyright */}
      <div className="copyright">
        © 2026 HomeHub. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;