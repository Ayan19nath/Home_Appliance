import React from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Info } from "lucide-react";

import "./Policy.css";

function ReturnPolicy() {
  return (
    <main className="policy-page">

      {/* Hero */}
      <section className="policy-hero return-hero">
        <div className="policy-hero-overlay">
          <div className="policy-container">

            <div className="policy-breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <span>Policies</span>
              <span>›</span>
              <strong>Return Policy</strong>
            </div>

            <h1><b>Return Policy</b></h1>

            <p>
              We want you to be completely satisfied with your purchase.
              If you're not happy with your order, here's how our return
              policy works.
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
              className="policy-nav"
            >
              <span className="policy-nav-icon">▤</span>
              <span>Terms & Conditions</span>
            </Link>

            <Link
              to="/return-policy"
              className="policy-nav active"
            >
              <RotateCcw size={22} />
              <span>Return Policy</span>
            </Link>

          </aside>

          {/* Main Content */}
          <article className="policy-content">

            <div className="policy-title">
              <div className="policy-title-icon">
                <RotateCcw size={30} />
              </div>

              <div>
                <h2><b>Return Policy</b></h2>
                <p>Last updated: 12 Sept 2026</p>
              </div>
            </div>

            <p className="policy-intro">
              At HomeHub, we strive to ensure that you receive high-quality
              products and a seamless shopping experience. If you are not
              completely satisfied with your purchase, you may return it
              under the following conditions.
            </p>

            <div className="policy-number-list">

              <div className="policy-number-item">
                <span>1</span>
                <div>
                  <h3>Return Eligibility</h3>
                  <p>
                    You can return most eligible items within 7 days of
                    receiving your order. The product must be unused, in its
                    original packaging, with all tags, manuals, and
                    accessories.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>2</span>
                <div>
                  <h3>Non-Returnable Items</h3>
                  <p>
                    Certain items may not be eligible for return, including
                    opened or used personal care items, software, digital
                    downloads, customized products, and clearance or final
                    sale items.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>3</span>
                <div>
                  <h3>How to Initiate a Return</h3>
                  <p>
                    To start a return, log in to your account and go to
                    "My Orders". Select the item you wish to return and
                    follow the instructions to submit your return request.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>4</span>
                <div>
                  <h3>Refund Process</h3>
                  <p>
                    After we receive and inspect the returned item, we will
                    process your refund within 5–7 business days. The refund
                    will be credited to your original payment method.
                  </p>
                </div>
              </div>

              <div className="policy-number-item">
                <span>5</span>
                <div>
                  <h3>Exchange</h3>
                  <p>
                    If you receive a damaged or defective item, we will
                    replace it at no additional cost. Please{" "}
                    <Link to="/contact">Contact Us</Link> within 7 days of
                    delivery with details and photos of the issue.
                  </p>
                </div>
              </div>

            </div>

            {/* Help Box */}
            <div className="policy-help">

              <div className="policy-help-icon">
                <Info size={23} />
              </div>

              <div>
                <h3>Need Help?</h3>

                <p>
                  If you have any questions about our return policy, please{" "}
                  <Link to="/contact">Contact Us</Link>.
                </p>
              </div>

            </div>

          </article>

        </div>

      </section>

    </main>
  );
}

export default ReturnPolicy;