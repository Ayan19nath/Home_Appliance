import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import api from "../api";

// "Verified" badge, or a "Not verified" button that emails a 6-digit code and opens the code page
// props: verified (true / false / undefined = still unknown), email, back (page to return to)
export default function VerifyBadge({ verified, email, back }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (verified === undefined) return null; // unknown until the server answers

  const look = { display: "inline-flex", alignItems: "center", gap: 5, height: "auto", marginTop: 6, marginRight: 0, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: 0 };

  if (verified) {
    return <span style={{ ...look, background: "#e8f8ef", color: "#159447" }}><BadgeCheck size={14} /> Verified</span>;
  }

  // Ask the server to email a code, then open the code page
  const start = async () => {
    setBusy(true);
    setError("");
    try {
      await api.post("/user/me/send-verification");
      navigate("/verify-otp", { state: { verifyEmail: email, back } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the code. Please try again.");
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" disabled={busy} onClick={start} title="Click to verify your email"
        style={{ ...look, background: "#fff4e5", color: "#c2410c", cursor: "pointer" }}>
        <ShieldAlert size={14} /> {busy ? "Sending code..." : "Not verified - click to verify"}
      </button>
      {error && <span style={{ display: "block", color: "#ffd2d2", fontSize: 12 }}>{error}</span>}
    </>
  );
}