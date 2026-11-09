import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, CheckCircle2, ArrowRight, Info, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { getUser } from "../data/session";
import { passwordProblem } from "../data/validation";
import updatePasswordImage from "../assets/images/update-password.jpeg";
import "./ChangePassword.css";

// Left side benefits: [icon, title, text]
const benefits = [
  [ShieldCheck, "More Security", "A stronger password helps keep your account safe."],
  [KeyRound, "Stay in Control", "You can access your account anytime, anywhere."],
  [CheckCircle2, "Peace of Mind", "Your data is always protected with us."],
];

// Password boxes: [name, label, autocomplete]
const boxes = [
  ["current", "Current Password", "current-password"],
  ["next", "New Password", "new-password"],
  ["confirm", "Confirm New Password", "new-password"],
];

const empty = { current: "", next: "", confirm: "" };

function ChangePassword() {
  const navigate = useNavigate();

  const [values, setValues] = useState(empty);
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!getUser()) return setError("Please login to change your password.");
    if (!values.current) return setError("Please enter your current password.");
    const problem = passwordProblem(values.next);
    if (problem) return setError(problem);
    if (values.next === values.current) return setError("New password must be different from your current password.");
    if (values.next !== values.confirm) return setError("New password and confirm password do not match.");

    setLoading(true);
    try {
      await api.put("/user/me/password", { currentPassword: values.current, newPassword: values.next });
      setValues(empty);
      setSuccess("Your password has been updated successfully.");
      setTimeout(() => navigate("/profile"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while updating your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="change-password-page">
      <section className="change-password-container">

        {/* ================= LEFT SIDE ================= */}
        <div className="change-password-left">
          <div className="change-password-image">
            <img src={updatePasswordImage} alt="Update Your Password" />
          </div>

          <h1>Update Your<span>Password</span></h1>
          <p className="change-password-intro">
            Keep your account safe! Choose a strong password to protect your information.
          </p>

          {benefits.map(([Icon, title, text]) => (
            <div className="password-benefit" key={title}>
              <div className="password-benefit-icon"><Icon size={25} /></div>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="change-password-right">
          <div className="change-password-form-wrapper">
            <h2>Update Your Password</h2>
            <p className="change-password-subtitle">
              Enter your new password below. Make sure it's strong and easy for you to remember but hard for others to guess.
            </p>

            {error && <div className="change-password-error">{error}</div>}
            {success && (
              <div className="change-password-success">
                <CheckCircle2 size={20} />
                <span>{success}</span>
              </div>
            )}

            <form className="change-password-form" onSubmit={handleSubmit}>
              {boxes.map(([name, label, autoComplete]) => (
                <div className="change-password-field" key={name}>
                  <label htmlFor={name}>{label}</label>

                  <div className="change-password-input">
                    <Lock size={21} />
                    <input
                      id={name}
                      type={show[name] ? "text" : "password"}
                      placeholder={label}
                      value={values[name]}
                      onChange={(e) => { setValues({ ...values, [name]: e.target.value }); setError(""); }}
                      autoComplete={autoComplete}
                    />
                    <button type="button" className="password-eye" onClick={() => setShow({ ...show, [name]: !show[name] })} aria-label="Show password">
                      {show[name] ? <EyeOff size={21} /> : <Eye size={21} />}
                    </button>
                  </div>

                  {name === "next" && (
                    <div className="password-hint">
                      <Info size={17} />
                      <span>Password must be at least 8 characters and include one letter, one number and one special character.</span>
                    </div>
                  )}
                </div>
              ))}

              <button type="submit" className="update-password-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="password-spinner"></span>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <KeyRound size={21} />
                    Update Password
                    <ArrowRight size={21} />
                  </>
                )}
              </button>
            </form>

            <Link to="/" className="back-home-link">
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}

export default ChangePassword;