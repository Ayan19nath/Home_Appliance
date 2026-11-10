import { useEffect, useState } from "react";
import api from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    api.get("/user").then((res) => setUsers(res.data)).catch(() => setError("Could not load users."));

  useEffect(() => {
    load();
  }, []);

  // Delete a user (the server blocks the owner, and only the owner can remove an admin)
  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.Email}?`)) return;
    try {
      await api.delete(`/user/${u._id}`);
      setError("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Search by name or email
  const q = search.trim().toLowerCase();
  const shown = users.filter((u) => !q || `${u.First_name} ${u.Last_name} ${u.Email}`.toLowerCase().includes(q));

  return (
    <section className="admin-box users">
      <h3>Users ({users.length})</h3>
      {error && <p className="admin-error">{error}</p>}

      <input
        style={{ width: "100%", marginBottom: 12, boxSizing: "border-box" }}
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th><th></th></tr>
          </thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan="5">No users found</td></tr>}
            {shown.map((u) => (
              <tr key={u._id}>
                <td>{u.First_name} {u.Last_name}</td>
                <td>{u.Email}</td>
                <td>{u.Mobile}</td>
                <td>{u.isOwner ? "Owner" : u.role}</td>
                <td>{!u.isOwner && <button className="danger" onClick={() => remove(u)}>Delete</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}