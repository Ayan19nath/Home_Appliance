import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { categoryIcons } from "../data/categoryIcons";
import AdminItems from "../Components/AdminItems";
import "./Admin.css";

const empty = { cat_name: "", cat_description: "", cat_icon: "" };

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);   // image file chosen from the computer
  const [fileKey, setFileKey] = useState(0);  // changing this clears the file picker
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Only the owner can see and handle admin requests
  const isOwner = localStorage.getItem("adminOwner") === "true";

  const loadCategories = () => api.get("/category").then((res) => setCategories(res.data));
  const loadRequests = () => api.get("/user/admin-requests").then((res) => setRequests(res.data));

  useEffect(() => {
    loadCategories();
    if (isOwner) loadRequests();
  }, [isOwner]);

  // Clear the form
  const resetForm = () => {
    setForm(empty);
    setImage(null);
    setEditId(null);
    setFileKey((key) => key + 1);
  };

  // Add or update a category (sent as form data because of the image file)
  const save = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      if (editId) await api.put(`/category/${editId}`, data);
      else await api.post("/category", data);
      resetForm();
      setError("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Fill the form to edit a category
  const edit = (c) => {
    setEditId(c._id);
    setForm({ cat_name: c.cat_name, cat_description: c.cat_description || "", cat_icon: c.cat_icon || "" });
    setImage(null);
    setFileKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a category
  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/category/${id}`);
      setError("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Approve or reject an admin request (owner only)
  const decide = async (id, approve) => {
    if (!window.confirm(approve ? "Approve this person as admin?" : "Reject this request?")) return;
    try {
      if (approve) await api.put(`/user/admin-requests/${id}/approve`);
      else await api.delete(`/user/admin-requests/${id}`);
      setError("");
      loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Log out the admin
  const logout = () => {
    ["adminToken", "adminRole", "adminOwner"].forEach((key) => localStorage.removeItem(key));
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <div className="admin-top">
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {/* ========== ADMIN REQUESTS (owner only) ========== */}
      {isOwner && (
        <>
          <h3 className="admin-section">Admin Requests ({requests.length})</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Mobile</th><th>Requested</th><th></th></tr>
              </thead>
              <tbody>
                {requests.length === 0 && <tr><td colSpan="5">No pending requests</td></tr>}
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td>{r.First_name} {r.Last_name}</td>
                    <td>{r.Email}</td>
                    <td>{r.Mobile}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="approve" onClick={() => decide(r._id, true)}>Approve</button>
                      <button className="danger" onClick={() => decide(r._id, false)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ========== CATEGORY FORM ========== */}
      <form className="admin-form" onSubmit={save}>
        <h3>{editId ? "Edit Category" : "Add Category"}</h3>

        <input placeholder="Name" value={form.cat_name} required
          onChange={(e) => setForm({ ...form, cat_name: e.target.value })} />
        <input placeholder="Description" value={form.cat_description}
          onChange={(e) => setForm({ ...form, cat_description: e.target.value })} />

        <select value={form.cat_icon} onChange={(e) => setForm({ ...form, cat_icon: e.target.value })}>
          <option value="">Choose an icon</option>
          {Object.keys(categoryIcons).map((name) => <option key={name} value={name}>{name}</option>)}
        </select>

        <label className="admin-file">
          Category image {editId && "(leave empty to keep the current image)"}
          <input key={fileKey} type="file" accept="image/*" required={!editId}
            onChange={(e) => setImage(e.target.files[0])} />
        </label>
        {image && <img className="admin-preview" src={URL.createObjectURL(image)} alt="Preview" />}

        <div>
          <button type="submit">{editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {/* ========== CATEGORY LIST ========== */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Description</th><th></th></tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td>{c.cat_image && <img src={c.cat_image} alt={c.cat_name} />}</td>
                <td>{c.cat_name}</td>
                <td>{c.cat_description}</td>
                <td>
                  <button onClick={() => edit(c)}>Edit</button>
                  <button className="danger" onClick={() => remove(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========== PRODUCTS ========== */}
      <AdminItems />
    </div>
  );
}