import React, { useMemo, useState } from "react";
import {
  Box,
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  ChevronDown,
  Search,
  MessageCircle,
  Package,
} from "lucide-react";

import { Link } from "react-router-dom";

import "./FAQ.css";

const faqData = [
  {
    id: 1,
    category: "Orders & Shipping",
    question: "How can I place an order on HomeHub?",
    answer:
      "To place an order, browse our products, select the product you want, choose the required quantity and click Add to Cart. Then open your cart, review your items and proceed to checkout. Enter your delivery details and select your preferred payment method to complete the order.",
  },
  {
    id: 2,
    category: "Account & Payment",
    question: "What payment methods do you accept?",
    answer:
      "HomeHub supports multiple payment methods including Credit Card, Debit Card, UPI, Net Banking and Cash on Delivery where available. You can select your preferred payment method during checkout.",
  },
  {
    id: 3,
    category: "Orders & Shipping",
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 3–7 business days depending on your location and product availability. You will receive order and delivery updates after your order has been confirmed.",
  },
  {
    id: 4,
    category: "Orders & Shipping",
    question: "Can I track my order?",
    answer:
      "Yes. Once your order has been shipped, you can track it using the order tracking option. Your tracking information will also be available through your order details.",
  },
  {
    id: 5,
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer:
      "Eligible products can generally be returned within 7 days of delivery. The product should be unused and in its original condition with all accessories and packaging. Return eligibility may vary by product.",
  },
  {
    id: 6,
    category: "Products",
    question: "Do you offer warranty on products?",
    answer:
      "Yes. Many of our products come with a manufacturer warranty. Warranty duration and terms depend on the product and brand. Please check the individual product details for specific warranty information.",
  },
  {
    id: 7,
    category: "Support",
    question: "How can I get customer support?",
    answer:
      "You can contact our support team through the Contact Us page. You can reach us by phone or email, and our team will be happy to help you with your questions.",
  },
  {
    id: 8,
    category: "Orders & Shipping",
    question: "Can I change or cancel my order?",
    answer:
      "You can request an order cancellation or modification as soon as possible after placing the order. Once the order has been shipped, cancellation or changes may no longer be possible.",
  },
  {
    id: 9,
    category: "Returns & Refunds",
    question: "How long does it take to receive a refund?",
    answer:
      "After the returned product is inspected and approved, the refund is generally processed according to the payment method used for the purchase. Processing time may vary depending on your bank or payment provider.",
  },
  {
    id: 10,
    category: "Products",
    question: "How do I know if a product is in stock?",
    answer:
      "Product availability is displayed on the product card or product details page. If a product is marked In Stock, it is currently available for purchase.",
  },
  {
    id: 11,
    category: "Account & Payment",
    question: "Is my payment information secure?",
    answer:
      "Yes. HomeHub is designed to keep your payment information secure. Payment processing is handled through secure payment systems and your sensitive payment information is not stored unnecessarily.",
  },
  {
    id: 12,
    category: "Support",
    question: "What should I do if I receive a damaged product?",
    answer:
      "If your product arrives damaged, please contact our support team as soon as possible with your order details and photographs of the product and packaging. Our support team will guide you through the next steps.",
  },
];

const categories = [
  {
    name: "All FAQs",
    icon: Box,
  },
  {
    name: "Orders & Shipping",
    icon: Truck,
  },
  {
    name: "Returns & Refunds",
    icon: RotateCcw,
  },
  {
    name: "Products",
    icon: Package,
  },
  {
    name: "Account & Payment",
    icon: CreditCard,
  },
  {
    name: "Support",
    icon: Headphones,
  },
];

function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState("All FAQs");
  const [searchText, setSearchText] = useState("");
  const [openFAQs, setOpenFAQs] = useState([]);

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const categoryMatch =
        selectedCategory === "All FAQs" ||
        faq.category === selectedCategory;

      const searchMatch =
        faq.question
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        faq.answer
          .toLowerCase()
          .includes(searchText.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchText]);

  const handleFAQClick = (id) => {
    setOpenFAQs((previous) => {
      if (previous.includes(id)) {
        return previous.filter((faqId) => faqId !== id);
      }

      return [...previous, id];
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setOpenFAQs([]);
  };

  return (
    <main className="faq-page">

      {/* FAQ Hero */}
      <section className="faq-hero">

        <div className="faq-hero-content">

          <div className="faq-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>FAQ</span>
          </div>

          <h1>
            Frequently Asked <span>Questions</span>
          </h1>

          <p>
            Find quick answers to the most common questions about our
            products, orders, shipping, returns and more.
          </p>

        </div>

        <div className="faq-hero-icon">
          <MessageCircle size={72} />
          <span>?</span>
        </div>

      </section>


      {/* FAQ Main Content */}
      <section className="faq-content">

        {/* Left Sidebar */}
        <aside className="faq-sidebar">

          <h2>Browse by Category</h2>

          <div className="faq-category-list">

            {categories.map((category) => {
              const Icon = category.icon;

              const count =
                category.name === "All FAQs"
                  ? faqData.length
                  : faqData.filter(
                      (faq) => faq.category === category.name
                    ).length;

              const active =
                selectedCategory === category.name;

              return (
                <button
                  key={category.name}
                  className={`faq-category-item ${
                    active ? "active" : ""
                  }`}
                  onClick={() =>
                    handleCategoryClick(category.name)
                  }
                >
                  <Icon size={23} />

                  <span className="faq-category-name">
                    {category.name}
                  </span>

                  <span className="faq-count">
                    {count}
                  </span>
                </button>
              );
            })}

          </div>


          {/* Support Box */}
          <div className="faq-support-box">

            <Headphones size={30} />

            <div>
              <h3>Still have questions?</h3>

              <p>
                Our support team is here to help!
              </p>

              <Link to="/contact">
                Contact Us →
              </Link>
            </div>

          </div>

        </aside>


        {/* Right FAQ Area */}
        <div className="faq-right">

          {/* Search */}
          <div className="faq-search-box">

            <Search size={22} />

            <input
              type="text"
              placeholder="Search for a question..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            {searchText && (
              <button
                className="faq-clear-search"
                onClick={() => setSearchText("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>


          {/* FAQ List */}
          <div className="faq-list">

            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => {

                const isOpen = openFAQs.includes(faq.id);

                return (
                  <div
                    className={`faq-item ${
                      isOpen ? "open" : ""
                    }`}
                    key={faq.id}
                  >

                    <button
                      className="faq-question"
                      onClick={() =>
                        handleFAQClick(faq.id)
                      }
                      aria-expanded={isOpen}
                    >

                      <span>
                        {faq.question}
                      </span>

                      <ChevronDown
                        size={21}
                        className="faq-chevron"
                      />

                    </button>


                    {isOpen && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}

                  </div>
                );
              })
            ) : (
              <div className="faq-no-result">

                <Search size={42} />

                <h3>No questions found</h3>

                <p>
                  Try another search term or choose
                  another category.
                </p>

                <button
                  onClick={() => {
                    setSearchText("");
                    setSelectedCategory("All FAQs");
                  }}
                >
                  View All FAQs
                </button>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}

export default FAQ;