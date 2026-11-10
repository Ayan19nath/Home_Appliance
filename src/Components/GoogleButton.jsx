import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { saveUser } from "../data/session";

// The Google button is shown only when VITE_GOOGLE_CLIENT_ID is set
export const googleReady = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

// "Continue with Google": the server checks the Google token and logs the customer in
export default function GoogleButton({ onError }) {
  const navigate = useNavigate();

  const handleSuccess = async ({ credential }) => {
    try {
      const { data } = await api.post("/user/google", { credential });
      saveUser({ ...data.user, token: data.token }, true);
      navigate("/login-success");
    } catch (err) {
      onError(err.response?.data?.message || "Google login failed. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError("Google login failed. Please try again.")}
        text="continue_with"
        shape="rectangular"
        width={String(Math.min(400, window.innerWidth - 90))}
      />
    </div>
  );
}