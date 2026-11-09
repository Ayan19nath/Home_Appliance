import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Admin.css";

const empty = { First_name: "", Last_name: "", Email: "", Mobile: "", Password: "" };

// Form fields: [name, placeholder, input type]
const fields = [
  ["First_name", "First name", "text"],
  ["Last_name", "Last name (optional)", "text"],
  ["Email", "Email", "email"],
  ["Mobile", "Mobile number (optional)", "tel"],
  ["Password", "Password (min 8 characters)", "password"],
];

export default function AdminRequest() {
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Send the request to the owner
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/user/admin-request", form);
      setMessage(data.message);
      setForm(empty);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed. Is the server running?");
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-card" onSubmit={handleSubmit}>
        <h2>Request Admin Access</h2>
        <p>The owner will review your request and email you the decision.</p>

        {error && <p className="admin-error">{error}</p>}
        {message && <p className="admin-success">{message}</p>}

        {fields.map(([name, placeholder, type]) => (
          <input
            key={name}
            type={type}
            placeholder={placeholder}
            value={form[name]}
            minLength={name === "Password" ? 8 : undefined}
            required={name !== "Last_name" && name !== "Mobile"}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          />
        ))}

        <button type="submit">Send Request</button>
        <button type="button" onClick={() => navigate("/login")}>Back to Login</button>
      </form>
    </div>
  );
}