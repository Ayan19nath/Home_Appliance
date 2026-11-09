import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const ok = localStorage.getItem("adminToken") && localStorage.getItem("adminRole") === "admin";
  return ok ? children : <Navigate to="/admin/login" replace />;
}