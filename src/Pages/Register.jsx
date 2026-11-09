import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, Calendar, Lock, Eye, EyeOff,
  Truck, ShieldCheck, Percent, Headphones, UserPlus, ArrowRight,
} from "lucide-react";
import api from "../api";
import Logo from "../Components/Logo";
import { passwordProblem, emailOk } from "../data/validation";
import "./Register.css";

// Left side benefits: [icon, title, text]
const benefits = [
  [Truck, "Fast & Reliable Delivery", "Get your products at your doorstep."],
  [ShieldCheck, "Secure Shopping", "Your data is always protected."],
  [Percent, "Exclusive Offers", "Special deals just for our members."],
  [Headphones, "24/7 Customer Support", "We're always here to help."],
];

const empty = { name: "", email: "", phone: "", dob: "", password: "", confirmPassword: "" };

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
    setSuccess("");
  };

  // Create the account in the database
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, phone, dob, password, confirmPassword } = form;

    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      return setError("Please fill in all required fields.");
    }
    if (!emailOk(email)) return setError("Please enter a valid email address.");
    const problem = passwordProblem(password);
    if (problem) return setError(problem);
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!agreeTerms) return setError("Please agree to the Terms & Conditions and Privacy Policy.");

    // the first word is the first name, the rest is the last name
    const [First_name, ...rest] = name.trim().split(/\s+/);

    setLoading(true);
    try {
      await api.post("/user", {
        First_name, Last_name: rest.join(" "), Email: email.trim(), Password: password, Mobile: phone.trim(), DOB: dob,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  // A text input with an icon
  const field = (name, type, placeholder, Icon, autoComplete) => (
    <div className="register-field">
      <div className="input-box">
        <Icon size={20} />
        <input type={type} name={name} placeholder={placeholder} value={form[name]} onChange={handleChange} autoComplete={autoComplete} />
      </div>
    </div>
  );

  // A password input with the show / hide button
  const passwordField = (name, placeholder) => (
    <div className="register-field full-width">
      <div className="input-box">
        <Lock size={20} />
        <input
          type={show[name] ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <button type="button" className="password-toggle" onClick={() => setShow({ ...show, [name]: !show[name] })} aria-label="Toggle password visibility">
          {show[name] ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <main className="register-page">
      <section className="register-wrapper">

        {/* ================= LEFT SIDE ================= */}
        <div className="register-left">
          <div className="register-left-content">
            <div className="register-logo"><Logo /></div>

            <h1>Create Your<span> Account</span></h1>
            <p className="register-intro">
              Join HomeHub today and enjoy a better shopping experience with exclusive offers, fast delivery and more!
            </p>

            {benefits.map(([Icon, title, text]) => (
              <div className="register-benefit" key={title}>
                <div className="benefit-icon"><Icon size={27} /></div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="register-right">
          <div className="register-form-container">
            <h2>Register</h2>
            <p className="register-subtitle">Fill in your details to create your account.</p>

            <form onSubmit={handleSubmit}>
              <div className="register-row">
                {field("name", "text", "Full Name *", User, "name")}
                {field("email", "email", "Email Address *", Mail, "email")}
              </div>

              <div className="register-row">
                {field("phone", "tel", "Phone Number *", Phone, "tel")}
                {field("dob", "date", "", Calendar)}
              </div>

              {passwordField("password", "Password *")}
              {passwordField("confirmPassword", "Confirm Password *")}

              {/* Terms */}
              <label className="terms-row">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                <span>
                  I agree to the <Link to="/terms-conditions">Terms & Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link>.
                </span>
              </label>

              {error && <p className="register-error">{error}</p>}
              {success && <p className="register-success">{success}</p>}

              <button type="submit" className="create-account-btn" disabled={loading}>
                <UserPlus size={21} />
                <span>{loading ? "Creating account..." : "Create Account"}</span>
                <ArrowRight size={21} />
              </button>

              <div className="register-divider">
                <span></span>
                <p>or</p>
                <span></span>
              </div>

              <button
                type="button"
                className="google-register-btn"
                onClick={() => alert("Google registration will be connected with backend OAuth later.")}
              >
                <span className="google-icon">G</span>
                <span>Continue with Google</span>
              </button>

              <p className="login-link-text">
                Already have an account?
                <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>

      </section>
    </main>
  );
}

export default Register;