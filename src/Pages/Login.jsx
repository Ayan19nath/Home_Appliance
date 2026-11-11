import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShoppingCart, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import Logo from "../Components/Logo";
import GoogleButton, { googleReady } from "../Components/GoogleButton";
import { saveUser, clearUser } from "../data/session";
import { emailOk } from "../data/validation";
import "./Login.css";

// Left side feature list: [icon, title, text]
const features = [
  [ShoppingCart, "Faster Checkout", "Save your details for a quicker shopping experience."],
  [Heart, "Save Your Wishlist", "Keep track of your favorite products."],
  [ShieldCheck, "Secure & Safe", "Your information is always protected."],
];

function Login() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [mode, setMode] = useState("customer"); // "customer" or "admin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // stay logged in by default
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email address.");
    if (!emailOk(email)) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    try {
      const { data } = await api.post("/user/login", { Email: email.trim(), Password: password });
      const isAdmin = data.role === "admin";

      // each account type logs in from its own tab
      if (mode === "admin" && !isAdmin) return setError("This account is not an admin.");
      if (mode === "customer" && isAdmin) return setError("Admin accounts must log in from the Admin tab.");

      if (isAdmin) {
        clearUser(); // one login at a time
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminRole", data.role);
        localStorage.setItem("adminOwner", data.isOwner ? "true" : "false");
        navigate("/admin/dashboard");
      } else {
        saveUser({ ...data.user, token: data.token }, rememberMe);
        navigate("/login-success");
      }
    } catch (err) {
      // email not verified yet: a code was emailed, open the code page
      if (err.response?.data?.needsVerification) {
        return navigate("/verify-otp", { state: { verifyEmail: err.response.data.email } });
      }
      setError(err.response?.data?.message || "Login failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-background">
        <section className="login-container">

          {/* ================= LEFT SIDE ================= */}
          <div className="login-left">
            <div className="login-logo"><Logo /></div>

            <h1>Welcome Back!</h1>
            <p className="login-welcome-text">Log in to your account and continue shopping with us.</p>

            {features.map(([Icon, title, text]) => (
              <div className="login-feature" key={title}>
                <div className="login-feature-icon"><Icon size={28} /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="login-right">
            <div className="login-form-wrapper">

              {/* Customer / Admin switch */}
              <div className="login-switch">
                {["customer", "admin"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={mode === type ? "active" : ""}
                    onClick={() => { setMode(type); setError(""); }}
                  >
                    {type === "customer" ? "Customer" : "Admin"}
                  </button>
                ))}
              </div>

              <h2>{mode === "admin" ? "Admin Login" : "Login to Your Account"}</h2>
              <p className="login-form-subtitle">
                {mode === "admin" ? "Only administrators can sign in here." : "Enter your email and password to continue."}
              </p>

              {/* Shown after the email was verified */}
              {state?.verified && !error && (
                <div className="login-error" style={{ background: "#f0fbf4", borderColor: "#bfe6cd", color: "#159447" }}>
                  Email verified! You can now log in.
                </div>
              )}

              {error && <div className="login-error">{error}</div>}

              <form className="login-form" onSubmit={handleLogin}>

                {/* Email */}
                <div className="login-field">
                  <label htmlFor="login-email">Email Address</label>
                  <div className="login-input-wrapper">
                    <Mail size={21} />
                    <input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="login-field">
                  <label htmlFor="login-password">Password</label>
                  <div className="login-input-wrapper">
                    <Lock size={21} />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      autoComplete="current-password"
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember me (customer only) + forgot password (customer and admin) */}
                <div className="login-options">
                  {mode === "customer" ? (
                    <label className="remember-me">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                      <span>Remember me</span>
                    </label>
                  ) : (
                    <span />
                  )}
                  <button type="button" className="forgot-password" onClick={() => navigate("/forgot-password")}>
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                  <span>{loading ? "Logging in..." : "Login"}</span>
                  {!loading && <ArrowRight size={22} />}
                </button>
              </form>

              {/* Admin mode: request access */}
              {mode === "admin" && (
                <p className="register-text">
                  Want to become an admin?
                  <button type="button" onClick={() => navigate("/admin/request")}>Request access</button>
                </p>
              )}

              {/* Customer mode: Google and register */}
              {mode === "customer" && (
                <>
                  {googleReady && (
                    <>
                      <div className="login-divider">
                        <span></span>
                        <p>or</p>
                        <span></span>
                      </div>
                      <GoogleButton onError={setError} />
                    </>
                  )}

                  <p className="register-text">
                    Don&apos;t have an account?
                    <button type="button" onClick={() => navigate("/register")}>Register</button>
                  </p>
                </>
              )}
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}

export default Login;