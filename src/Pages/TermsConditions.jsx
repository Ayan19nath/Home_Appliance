import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import "./Policy.css";

function TermsConditions() {
  return (
    <main className="policy-page">

      {/* Hero */}
      <section className="policy-hero terms-hero">
        <div className="policy-hero-overlay">
          <div className="policy-container">

            <div className="policy-breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span>Policies</span>
              <span>›</span>
              <strong>Terms & Conditions</strong>
            </div>

            <h1><b>Terms & Conditions</b></h1>

            <p>
              Please read these Terms & Conditions carefully before using our
              website, making a purchase, or accessing any services provided
              by HomeHub.
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
              className="policy-nav"
            >
              <span className="policy-nav-icon">♢</span>
              <span>Privacy Policy</span>
            </Link>

            <Link
              to="/terms-conditions"
              className="policy-nav active"
            >
              <FileText size={22} />
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
                <FileText size={30} />
              </div>

              <div>
                <h2><b>Terms & Conditions</b></h2>
                <p>Last updated: 12 Sept 2026</p>
              </div>
            </div>

            <div className="policy-number-list">

              <div className="policy-number-item">
                <span>1</span>
                <div>
                  <h3>Acceptance of Terms</h3>
                  <p>
                    By accessing or using the HomeHub website, you agree to
                    be bound by these Terms & Conditions and all applicable
                    laws and regulations. If you do not agree with any part
                    of these terms, you must not use our website or services.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>2</span>
                <div>
                  <h3>Account Registration</h3>
                  <p>
                    To make purchases or access certain features, you may be
                    required to create an account. You agree to provide
                    accurate, complete, and up-to-date information and are
                    responsible for maintaining the confidentiality of your
                    account credentials.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>3</span>
                <div>
                  <h3>Products and Services</h3>
                  <p>
                    All products and services listed on HomeHub are subject
                    to availability. We reserve the right to modify,
                    discontinue, or change any product or service without
                    prior notice.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>4</span>
                <div>
                  <h3>Pricing and Payment</h3>
                  <p>
                    All prices are listed in local currency and may be
                    subject to change without notice. You agree to pay the
                    total amount applicable to your order, including taxes
                    and shipping charges where applicable.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>5</span>
                <div>
                  <h3>Shipping and Delivery</h3>
                  <p>
                    We aim to deliver orders within the estimated delivery
                    time. Delivery times may vary due to factors beyond our
                    control, including weather, holidays, or carrier delays.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>6</span>
                <div>
                  <h3>Returns and Refunds</h3>
                  <p>
                    Our Return Policy explains the conditions under which
                    products may be returned. Please review the Return Policy
                    for detailed information about eligibility and refunds.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>7</span>
                <div>
                  <h3>Limitation of Liability</h3>
                  <p>
                    HomeHub will not be liable for indirect, incidental,
                    special, or consequential damages arising from the use
                    of our website, products, or services.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>8</span>
                <div>
                  <h3>Changes to This Policy</h3>
                  <p>
                    We reserve the right to update or change these Terms &
                    Conditions at any time. Changes will become effective
                    immediately upon being posted on this page.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>9</span>
                <div>
                  <h3>Contact Us</h3>
                  <p>
                    If you have any questions about these Terms & Conditions,
                    please{" "}
                    <Link to="/contact">Contact Us</Link>.
                  </p>
                </div>
              </div>

            </div>

          </article>

        </div>

      </section>

    </main>
  );
}

export default TermsConditions;