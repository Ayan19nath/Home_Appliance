import React from "react";

import {
  CheckCircle2,
  ShoppingCart,
  UserCircle,
  Truck,
  ShieldCheck,
  Percent,
  Headphones,
  ArrowRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import "./LoginSuccess.css";

function LoginSuccess() {
  const navigate = useNavigate();

  const getLoggedInUser = () => {
    try {
      const sessionUser = sessionStorage.getItem(
        "homehub-user"
      );

      if (sessionUser) {
        return JSON.parse(sessionUser);
      }

      const localUser = localStorage.getItem(
        "homehub-user"
      );

      if (localUser) {
        const parsedUser = JSON.parse(localUser);

        if (parsedUser?.loggedIn) {
          return parsedUser;
        }
      }

      return null;
    } catch (error) {
      console.error(
        "Login Success User Error:",
        error
      );

      return null;
    }
  };

  const user = getLoggedInUser();

  const userName =
    user?.name ||
    user?.fullName ||
    "HomeHub User";

  const userEmail =
    user?.email ||
    "Your account email";

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleMyAccount = () => {
    navigate("/profile");
  };

  return (
    <main className="login-success-page">

      <div className="login-success-background">

        <section className="login-success-container">

          {/* ================= LEFT SIDE ================= */}

          <div className="login-success-left">

            <div className="success-left-content">

              {/* LOGO */}

              <div className="success-logo">

                <Link to="/">

                  <svg
                    className="success-homehub-logo"
                    viewBox="0 0 260 70"
                    xmlns="http://www.w3.org/2000/svg"
                  >

                    <g
                      fill="none"
                      stroke="#103e6b"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >

                      <path d="M8 30 L38 7 L68 30" />

                      <path d="M16 25 V57 H60 V25" />

                      <path d="M51 18 V7 H60 V25" />

                    </g>

                    <g fill="#103e6b">

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
                      fill="#103e6b"
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
                      fill="#103e6b"
                      fontSize="7"
                      fontWeight="500"
                      fontFamily="Arial, Helvetica, sans-serif"
                      letterSpacing="1"
                    >
                      YOUR HOME, OUR APPLIANCES
                    </text>

                  </svg>

                </Link>

              </div>


              {/* LEFT HEADING */}

              <h1>
                Welcome to
                <span>
                  HomeHub!
                </span>
              </h1>

              <p className="success-left-description">
                Your account has been successfully
                logged in. Explore, shop and make
                your home better with us.
              </p>


              {/* FEATURES */}

              <div className="success-feature">

                <div className="success-feature-icon">
                  <Truck size={25} />
                </div>

                <div>

                  <h3>
                    Fast &amp; Reliable Delivery
                  </h3>

                  <p>
                    Get your products at your doorstep.
                  </p>

                </div>

              </div>


              <div className="success-feature">

                <div className="success-feature-icon">
                  <ShieldCheck size={25} />
                </div>

                <div>

                  <h3>
                    Secure Shopping
                  </h3>

                  <p>
                    Your data is always protected.
                  </p>

                </div>

              </div>


              <div className="success-feature">

                <div className="success-feature-icon">
                  <Percent size={25} />
                </div>

                <div>

                  <h3>
                    Exclusive Offers
                  </h3>

                  <p>
                    Special deals just for our members.
                  </p>

                </div>

              </div>


              <div className="success-feature">

                <div className="success-feature-icon">
                  <Headphones size={25} />
                </div>

                <div>

                  <h3>
                    24/7 Customer Support
                  </h3>

                  <p>
                    We&apos;re always here to help.
                  </p>

                </div>

              </div>


              {/* APPLIANCE VISUAL */}

              <div className="success-appliance-visual">

                <div className="success-appliance-card refrigerator">
                  <div className="appliance-line"></div>
                  <div className="appliance-handle"></div>
                </div>

                <div className="success-appliance-card washer">
                  <div className="washer-door"></div>
                </div>

                <div className="success-appliance-card tv">

                  <div className="tv-screen">
                    <span></span>
                  </div>

                  <div className="tv-stand"></div>

                </div>

                <div className="success-appliance-card microwave">
                  <div className="microwave-screen"></div>
                </div>

                <div className="success-appliance-plant">
                  🌿
                </div>

              </div>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="login-success-right">

            <div className="success-right-content">

              {/* SUCCESS ICON */}

              <div className="success-check-wrapper">

                <div className="success-check-outer">

                  <div className="success-check-inner">

                    <CheckCircle2
                      size={58}
                      strokeWidth={2.4}
                    />

                  </div>

                </div>

              </div>


              {/* TITLE */}

              <h2>
                Login Successful!
              </h2>

              <p className="success-main-text">
                Your account has been logged in successfully.
                <br />
                Welcome to HomeHub!
              </p>


              {/* USER CARD */}

              <div className="success-user-card">

                <div className="success-user-icon">

                  <UserCircle
                    size={48}
                    strokeWidth={1.8}
                  />

                </div>

                <div className="success-user-info">

                  <h3>
                    {userName}
                  </h3>

                  <p>
                    {userEmail}
                  </p>

                </div>

                <div className="online-status">

                  <span className="online-dot"></span>

                  <span>
                    Online
                  </span>

                </div>

              </div>


              {/* CONTINUE SHOPPING */}

              <button
                type="button"
                className="success-shopping-btn"
                onClick={handleContinueShopping}
              >

                <ShoppingCart size={21} />

                <span>
                  Continue Shopping
                </span>

                <ArrowRight size={23} />

              </button>


              {/* MY ACCOUNT */}

              <button
                type="button"
                className="success-account-btn"
                onClick={handleMyAccount}
              >

                <UserCircle size={21} />

                <span>
                  Go to My Account
                </span>

              </button>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default LoginSuccess;