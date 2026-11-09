import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import api from "../api";
import { passwordProblem } from "../data/validation";
import "./ResetPassword.css";

// Password boxes: [name, label, placeholder]
const boxes = [
  ["password", "New Password *", "Enter new password"],
  ["confirm", "Confirm New Password *", "Confirm new password"],
];

function ResetPassword() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("homehub-reset-token");

  const [values, setValues] = useState({ password: "", confirm: "" });
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Save the new password in the database
  const handleReset = async (event) => {
    event.preventDefault();
    setError("");

    const problem = passwordProblem(values.password);
    if (problem) return setError(problem);
    if (values.password !== values.confirm) return setError("Passwords do not match.");

    try {
      await api.post("/user/reset-password", { resetToken: token, newPassword: values.password });
      sessionStorage.removeItem("homehub-reset-token");
      sessionStorage.removeItem("homehub-reset-email");
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // The code was not verified
  if (!token && !success) {
    return (
      <main className="reset-page">
        <section className="reset-container">
          <div className="reset-icon error-reset-icon"><ShieldCheck size={42} /></div>
          <h1>Verification Required</h1>
          <p>Please verify your email with the code before resetting your password.</p>
          <button type="button" className="reset-main-btn" onClick={() => navigate("/forgot-password")}>
            Go to Forgot Password
            <ArrowRight size={20} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="reset-page">
      <section className="reset-container">
        {!success ? (
          <>
            <div className="reset-icon"><Lock size={42} /></div>

            <h1>Reset Your Password</h1>
            <p className="reset-subtitle">Create a new password for your HomeHub account.</p>

            <form className="reset-form" onSubmit={handleReset}>
              {boxes.map(([name, label, placeholder]) => (
                <div className="reset-field" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <div className="reset-input-wrapper">
                    <Lock size={20} />
                    <input
                      id={name}
                      type={show[name] ? "text" : "password"}
                      placeholder={placeholder}
                      value={values[name]}
                      onChange={(e) => { setValues({ ...values, [name]: e.target.value }); setError(""); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className="reset-eye-btn" onClick={() => setShow({ ...show, [name]: !show[name] })} aria-label="Toggle password">
                      {show[name] ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="password-rule">
                <ShieldCheck size={18} />
                <span>Password must be at least 8 characters and include a letter, a number and a special character.</span>
              </div>

              {error && <p className="reset-error">{error}</p>}

              <button type="submit" className="reset-main-btn">
                <span>Reset Password</span>
                <ArrowRight size={21} />
              </button>
            </form>

            <p className="reset-back-login">
              Remember your password?
              <Link to="/login">Login</Link>
            </p>
          </>
        ) : (
          <div className="reset-success">
            <div className="reset-success-icon"><CheckCircle2 size={48} /></div>
            <h1>Password Reset Successfully!</h1>
            <p>Your HomeHub password has been updated successfully.</p>
            <p className="reset-success-small">You can now login using your new password.</p>
            <button type="button" className="reset-main-btn" onClick={() => navigate("/login")}>
              Back to Login
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ResetPassword;