import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import "./Policy.css";

function PrivacyPolicy() {
  return (
    <main className="policy-page">

      {/* Hero */}
      <section className="policy-hero">
        <div className="policy-hero-overlay">
          <div className="policy-container">

            <div className="policy-breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span>Policies</span>
              <span>›</span>
              <strong>Privacy Policy</strong>
            </div>

            <h1><b>Privacy Policy</b></h1>

            <p>
              Your privacy is important to us. This Privacy Policy explains
              how we collect, use, and protect your personal information.
            </p>

          </div>
        </div>
      </section>

      {/* Content */}
      <section className="policy-section">

        <div className="policy-container policy-layout">

          {/* Sidebar */}
          <aside className="policy-sidebar">

            <h2>Our Policies</h2>

            <Link
              to="/privacy-policy"
              className="policy-nav active"
            >
              <ShieldCheck size={22} />
              <span>Privacy Policy</span>
            </Link>

            <Link
              to="/terms-conditions"
              className="policy-nav"
            >
              <span className="policy-nav-icon">▤</span>
              <span>Terms & Conditions</span>
            </Link>

            <Link
              to="/return-policy"
              className="policy-nav"
            >
              <span className="policy-nav-icon">↶</span>
              <span>Return Policy</span>
            </Link>

          </aside>

          {/* Main Content */}
          <article className="policy-content">

            <div className="policy-title">
              <div className="policy-title-icon">
                <ShieldCheck size={30} />
              </div>

              <div>
                <h2><b>Privacy Policy</b></h2>
                <p>Last updated: 12 Sept 2026</p>
              </div>
            </div>

            <div className="policy-text">

              <h3>1. Information We Collect</h3>
              <p>
                We collect personal information that you provide to us, such
                as your name, email address, phone number, shipping address,
                and payment details. We may also collect certain information
                automatically when you visit our website, such as your IP
                address, browser type, and device information.
              </p>

              <h3>2. How We Use Your Information</h3>
              <p>
                We use your information to process orders, provide customer
                support, improve our services, and personalize your shopping
                experience. We may also use your information to send
                promotional communications when you have opted in.
              </p>

              <h3>3. Sharing Your Information</h3>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share necessary information with trusted
                service providers who help us operate our website, process
                payments, and deliver your orders.
              </p>

              <h3>4. Security</h3>
              <p>
                We take reasonable measures to protect your personal
                information from unauthorized access, use, or disclosure.
                However, no method of transmission over the internet is
                completely secure.
              </p>

              <h3>5. Your Rights</h3>
              <p>
                You have the right to access, update, or request deletion of
                your personal information. If you would like to exercise any
                of these rights, please contact our support team.
              </p>

              <h3>6. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. Any
                changes will be posted on this page along with the updated
                date.
              </p>

            </div>

            <div className="policy-contact">
              If you have any questions about this Privacy Policy, please{" "}
              <Link to="/contact">Contact Us</Link>.
            </div>

          </article>

        </div>

      </section>

    </main>
  );
}

export default PrivacyPolicy;