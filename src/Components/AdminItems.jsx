import { useEffect, useState } from "react";
import api from "../api";

const slotNames = ["Front", "Back", "Side", "Detail"];
const emptyForm = { name: "", brand: "", category: "", price: "", oldPrice: "", stock: "", rating: "", reviews: "", features: "", description: "" };
const noFiles = [null, null, null, null];
const noFlags = [false, false, false, false];

export default function AdminItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState(noFiles);      // new images chosen from the computer
  const [removed, setRemoved] = useState(noFlags);  // saved images marked for removal
  const [existing, setExisting] = useState([]);     // saved images (edit mode)
  const [fileKey, setFileKey] = useState(0);        // changing this clears the file pickers
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/item").then((res) => setItems(res.data));

  useEffect(() => {
    load();
    api.get("/category").then((res) => setCategories(res.data));
  }, []);

  // Products that are out of stock or running low (5 or fewer)
  const lowCount = items.filter((item) => Number(item.stock) <= 5).length;

  // Update one form field
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Clear the form
  const resetForm = () => {
    setForm(emptyForm);
    setFiles(noFiles);
    setRemoved(noFlags);
    setExisting([]);
    setEditId(null);
    setFileKey((key) => key + 1);
  };

  // Add or update a product (sent as form data because of the image files)
  const save = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    files.forEach((file, i) => file && data.append(`image${i}`, file));
    removed.forEach((flag, i) => flag && data.append("removeImages", i));

    try {
      if (editId) await api.put(`/item/${editId}`, data);
      else await api.post("/item", data);
      resetForm();
      setError("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Fill the form to edit a product
  const edit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      brand: item.brand || "",
      category: item.categoryId,
      price: item.price,
      oldPrice: item.oldPrice || "",
      stock: item.stock,
      rating: item.rating,
      reviews: item.reviews,
      features: (item.features || []).join(", "),
      description: item.description || "",
    });
    setExisting(item.images || []);
    setFiles(noFiles);
    setRemoved(noFlags);
    setFileKey((key) => key + 1);
    document.getElementById("item-form")?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete a product (its images are deleted too)
  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/item/${id}`);
      setError("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // Choose a file for one slot
  const setSlot = (index, file) => setFiles(files.map((f, i) => (i === index ? file : f)));

  // Mark a saved image for removal
  const toggleRemoved = (index) => setRemoved(removed.map((flag, i) => (i === index ? !flag : flag)));

  return (
    <>
      <h3 className="admin-section">Products ({items.length})</h3>
      {error && <p className="admin-error">{error}</p>}

      {/* Stock alert */}
      {lowCount > 0 && (
        <p className="admin-error" style={{ background: "#fff8ec", borderColor: "#f1d9a0", color: "#b45f00" }}>
          ⚠ {lowCount} product{lowCount > 1 ? "s are" : " is"} out of stock or running low (5 or fewer). Check the highlighted rows below.
        </p>
      )}

      {/* ========== PRODUCT FORM ========== */}
      <form className="admin-form" id="item-form" onSubmit={save}>
        <h3>{editId ? "Edit Product" : "Add Product"}</h3>

        <input placeholder="Product name" value={form.name} onChange={set("name")} required />
        <input placeholder="Brand" value={form.brand} onChange={set("brand")} />

        <select value={form.category} onChange={set("category")} required>
          <option value="">Choose a category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.cat_name}</option>)}
        </select>

        <div className="admin-row">
          <input type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={set("price")} required />
          <input type="number" min="0" placeholder="Old price (₹)" value={form.oldPrice} onChange={set("oldPrice")} />
          <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={set("stock")} required />
        </div>

        <div className="admin-row">
          <input type="number" min="0" max="5" step="0.1" placeholder="Rating (0 to 5)" value={form.rating} onChange={set("rating")} />
          <input type="number" min="0" placeholder="Number of reviews" value={form.reviews} onChange={set("reviews")} />
        </div>

        <input placeholder="Features, separated by commas (e.g. Double Door, Frost Free)" value={form.features} onChange={set("features")} />
        <textarea placeholder="Description" value={form.description} onChange={set("description")} />

        {/* Four image slots */}
        <div className="admin-images">
          {slotNames.map((label, i) => {
            const src = files[i] ? URL.createObjectURL(files[i]) : !removed[i] && existing[i];
            return (
              <div className="admin-slot" key={label}>
                <span>{label}{i === 0 && " *"}</span>
                {src ? <img src={src} alt={label} /> : <div className="admin-slot-empty">No image</div>}
                <input
                  key={fileKey}
                  type="file"
                  accept="image/*"
                  required={i === 0 && !editId}
                  onChange={(e) => setSlot(i, e.target.files[0] || null)}
                />
                {existing[i] && !files[i] && (
                  <small>
                    <input type="checkbox" checked={removed[i]} onChange={() => toggleRemoved(i)} />
                    Remove this image
                  </small>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <button type="submit">{editId ? "Update" : "Add"}</button>
          {editId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      {/* ========== PRODUCT LIST ========== */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan="6">No products yet</td></tr>}
            {items.map((item) => {
              const left = Number(item.stock);
              const color = left <= 0 ? "#d23939" : left <= 5 ? "#e67e00" : undefined; // red = out, orange = low
              return (
                <tr key={item.id} style={color ? { background: left <= 0 ? "#fff3f2" : "#fff8ec" } : undefined}>
                  <td>{item.image && <img src={item.image} alt={item.name} />}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{Number(item.price).toLocaleString("en-IN")}</td>
                  <td style={color ? { color, fontWeight: 700 } : undefined}>
                    {item.stock}{color && (left <= 0 ? " - Out of stock" : " - Low")}
                  </td>
                  <td>
                    <button onClick={() => edit(item)}>Edit</button>
                    <button className="danger" onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}