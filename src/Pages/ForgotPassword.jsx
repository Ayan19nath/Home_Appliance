import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Send, Clock3, ShieldCheck, Home, LockKeyhole, MessageCircle } from "lucide-react";
import api from "../api";
import Logo from "../Components/Logo";
import { emailOk } from "../data/validation";
import "./ForgotPassword.css";

// Left side benefits: [icon, title, text]
const benefits = [
  [Mail, "Verify Your Email", "We'll email a 6-digit code to your registered email address."],
  [Clock3, "Quick & Easy", "Receive a code and reset your password in just a few steps."],
  [ShieldCheck, "Secure", "Your account information stays protected throughout the process."],
];

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ask the server to email a code
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email address.");
    if (!emailOk(email)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      await api.post("/user/forgot-password", { Email: email.trim() });
      sessionStorage.setItem("homehub-reset-email", email.trim().toLowerCase());
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-page">
      <section className="forgot-wrapper">

        {/* ================= LEFT SIDE ================= */}
        <div className="forgot-left">
          <div className="forgot-left-content">
            <div className="forgot-logo"><Logo /></div>

            <div className="forgot-illustration">
              <div className="illustration-circle"></div>
              <div className="illustration-home"><Home size={76} strokeWidth={2.2} /></div>
              <div className="illustration-lock"><LockKeyhole size={78} strokeWidth={2.1} /></div>
              <div className="illustration-password">
                <Mail size={22} strokeWidth={2} />
                <span>OTP</span>
                <MessageCircle size={22} strokeWidth={2} />
              </div>
              <div className="illustration-question">?</div>
            </div>

            <h1>Forgot Your<span>Password?</span></h1>
            <p className="forgot-intro">
              No worries! Enter your registered email address and we'll send you a code to reset your password.
            </p>

            {benefits.map(([Icon, title, text]) => (
              <div className="forgot-benefit" key={title}>
                <div className="forgot-benefit-icon"><Icon size={24} /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="forgot-right">
          <div className="forgot-form-container">
            <h2>Reset Your Password</h2>
            <p className="forgot-subtitle">Enter your registered email address and we'll send you a code.</p>

            <form onSubmit={handleSubmit}>
              <div className="forgot-field">
                <label htmlFor="forgot-email">Email Address *</label>
                <div className="forgot-input-box">
                  <Mail size={21} />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    autoComplete="email"
                  />
                </div>
              </div>

              {error && <p className="forgot-error">{error}</p>}

              <button type="submit" className="send-reset-btn" disabled={loading}>
                <Send size={20} />
                <span>{loading ? "Sending code..." : "Send Code"}</span>
                {!loading && <span className="reset-arrow">→</span>}
              </button>

              <p className="remember-password">
                Remember your password?
                <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>

      </section>
    </main>
  );
}

export default ForgotPassword;