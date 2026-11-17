import { Navigate } from "react-router-dom";
import { getUser } from "../data/session";

// Opens a page only for a logged-in customer or admin. A visitor is sent to the login page.
export default function RequireLogin({ children }) {
  const admin = !!localStorage.getItem("adminToken") && localStorage.getItem("adminRole") === "admin";
  return getUser() || admin ? children : <Navigate to="/login" replace />;
}