import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, ArrowRight, RotateCcw, LockKeyhole } from "lucide-react";
import api from "../api";
import Logo from "../Components/Logo";
import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // "verifying" = email check of an account; otherwise = forgot password
  // state.back = page to return to after verifying (set when a logged-in user verifies from the profile)
  const verifying = Boolean(state?.verifyEmail);
  const email = state?.verifyEmail || sessionStorage.getItem("homehub-reset-email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);

  // No email saved: start again
  useEffect(() => {
    if (!email) navigate(verifying ? "/register" : "/forgot-password");
  }, [email, verifying, navigate]);

  // Countdown for the "Resend" button
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Check the code with the server
  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("Please enter the 6-digit code.");

    setLoading(true);
    try {
      if (verifying) {
        await api.post("/user/verify-email", { Email: email, otp });
        navigate(state.back || "/login", { state: { verified: true } });
      } else {
        const { data } = await api.post("/user/verify-otp", { Email: email, otp });
        sessionStorage.setItem("homehub-reset-token", data.resetToken);
        navigate("/reset-password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send a new code
  const handleResend = async () => {
    try {
      await api.post(verifying ? "/user/resend-verification" : "/user/forgot-password", { Email: email });
      setOtp("");
      setError("");
      setTimeLeft(60);
    } catch {
      setError("Could not send a new code. Please try again.");
    }
  };

  // j***@gmail.com
  const maskedEmail = email.replace(/^(.).*(@.*)$/, "$1***$2");

  return (
    <main className="otp-page">
      <section className="otp-container">
        <div className="otp-logo"><Logo /></div>

        <div className="otp-icon">
          <ShieldCheck size={46} strokeWidth={2} />
        </div>

        <h1>Verify Your Email</h1>
        <p className="otp-subtitle">We've sent a 6-digit code to your email address. It is valid for 10 minutes.</p>

        <div className="otp-mobile">
          <Mail size={18} />
          <span>{maskedEmail}</span>
        </div>

        <form className="otp-form" onSubmit={handleVerify}>
          <label htmlFor="otp">Enter Code</label>

          <div className="otp-input-wrapper">
            <LockKeyhole size={20} />
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
              autoComplete="one-time-code"
            />
          </div>

          {error && <p className="otp-error">{error}</p>}

          <button type="submit" className="otp-verify-btn" disabled={loading}>
            <span>{loading ? "Verifying..." : "Verify Code"}</span>
            {!loading && <ArrowRight size={21} />}
          </button>
        </form>

        <div className="otp-resend">
          {timeLeft > 0 ? (
            <p>Resend code in <strong>{timeLeft}s</strong></p>
          ) : (
            <button type="button" onClick={handleResend}>
              <RotateCcw size={16} />
              Resend Code
            </button>
          )}
        </div>

        <p className="otp-back">
          {state?.back ? (
            <>Not now?<Link to={state.back}>Go back</Link></>
          ) : (
            <>Wrong email address?<Link to={verifying ? "/register" : "/forgot-password"}>Change Email</Link></>
          )}
        </p>
      </section>
    </main>
  );
}

export default VerifyOTP;