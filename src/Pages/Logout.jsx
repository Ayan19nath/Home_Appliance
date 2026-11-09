import { useEffect } from "react";
import { LogOut, Home, UserRound, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../data/session";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  // Log the customer out as soon as this page opens
  useEffect(() => {
    clearUser();
  }, []);

  return (
    <main className="logout-page">
      <section className="logout-section">
        <div className="logout-card">

          <div className="logout-icon-wrapper">
            <div className="logout-icon-circle">
              <LogOut size={82} />
            </div>
          </div>

          <div className="logout-content">
            <h1>You Have Logged Out</h1>
            <p className="logout-thank-you">Thank you for visiting <strong>HomeHub!</strong></p>
            <p className="logout-message">You have been successfully logged out of your account.</p>
          </div>

          <div className="logout-actions">
            <button type="button" className="logout-home-button" onClick={() => navigate("/")}>
              <Home size={21} />
              <span>Go to Homepage</span>
              <ArrowRight size={22} />
            </button>

            <button type="button" className="logout-login-button" onClick={() => navigate("/login")}>
              <UserRound size={21} />
              <span>Login Again</span>
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Logout;