import { useEffect, useState } from "react";
import api from "../api";

// isOwner = the main admin, canManage = owner or an admin with the "manage admins" power, myId = the logged-in admin
export default function AdminUsers({ isOwner, canManage, myId }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    api.get("/user").then((res) => setUsers(res.data)).catch(() => setError("Could not load users."));

  useEffect(() => {
    load();
  }, []);

  // Run a server call, show any error, then reload the list
  const run = async (call) => {
    try {
      await call();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    load();
  };

  // Delete a user (the server checks the rules again; a removed admin is logged out at once)
  const remove = (u) =>
    window.confirm(u.role === "admin" ? `Remove the admin ${u.Email}? They lose access at once.` : `Delete ${u.Email}?`) &&
    run(() => api.delete(`/user/${u._id}`));

  // Give or take back the power to approve and remove admins (owner only)
  const togglePower = (u) => {
    const give = !u.canManageAdmins;
    const text = give
      ? `Let ${u.Email} approve admin requests and remove admins?`
      : `Take back this power from ${u.Email}?`;
    return window.confirm(text) && run(() => api.put(`/user/${u._id}/manage-admins`, { allow: give }));
  };

  // Who can be deleted: customers by every admin; admins by the owner or an admin manager. Never the owner, never yourself.
  const canDelete = (u) => !u.isOwner && u._id !== myId && (u.role !== "admin" || canManage);

  // Search by name or email
  const q = search.trim().toLowerCase();
  const shown = users.filter((u) => !q || `${u.First_name} ${u.Last_name} ${u.Email}`.toLowerCase().includes(q));

  return (
    <section className="admin-box users">
      <h3>Users ({users.length})</h3>
      {error && <p className="admin-error">{error}</p>}
      {isOwner && (
        <p style={{ margin: "0 0 12px", color: "#667d91", fontSize: 13 }}>
          Give power lets an admin approve admin requests and remove admins while you are away. You can take it back at any time.
        </p>
      )}

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
                <td>{u.isOwner ? "Owner" : u.role === "admin" && u.canManageAdmins ? "Admin (manager)" : u.role}</td>
                <td>
                  {isOwner && u.role === "admin" && !u.isOwner && (
                    <button className="edit" onClick={() => togglePower(u)}>
                      {u.canManageAdmins ? "Take back power" : "Give power"}
                    </button>
                  )}
                  {canDelete(u) && <button className="danger" onClick={() => remove(u)}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}