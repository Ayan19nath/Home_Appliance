import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Admin.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ Email: "", Password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/login", form);
      if (data.role !== "admin") return setError("This account is not an admin");
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.role);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <p className="admin-error">{error}</p>}
        <input type="email" placeholder="Email" value={form.Email}
          onChange={(e) => setForm({ ...form, Email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.Password}
          onChange={(e) => setForm({ ...form, Password: e.target.value })} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}