import { useEffect, useRef, useState } from "react";
import {
  User, Mail, Phone, CalendarDays, Package, Heart, MapPin,
  Pencil, Camera, Star, ShoppingBag, ArrowRight, LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useWishlist } from "../Context/WishlistContext";
import { getUser, updateUser } from "../data/session";
import CategoryOffer from "../assets/images/Category_offer.jpeg";
import "./Profile.css";

// Profile fields: [name, label, icon, input type]
const fields = [
  ["name", "Full Name", User, "text"],
  ["email", "Email Address", Mail, "email"],
  ["phone", "Phone Number", Phone, "tel"],
  ["dob", "Date of Birth", CalendarDays, "date"],
];

// Shortcut buttons under the banner: [text, shop category, icon]
const shortcuts = [
  ["TV & Audio", "Televisions", ShoppingBag],
  ["Kitchen Appliances", "Kitchen Appliances", Package],
  ["Home Appliances", "Home Appliances", ShoppingBag],
  ["Small Appliances", "Small Appliances", ShoppingBag],
];

const guest = { name: "Guest User", email: "Please login to view your account", phone: "Not available", dob: "Not available" };
const emptyForm = { name: "", email: "", phone: "", dob: "" };
const imageKey = (email) => `homehub-profile-image-${email}`;

function Profile() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const fileInput = useRef(null);

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [image, setImage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [orderCount, setOrderCount] = useState(0);

  // Load the logged-in customer and refresh when the login changes
  useEffect(() => {
    const load = () => {
      const current = getUser();
      setUser(current);
      setForm(current ? { name: current.name || "", email: current.email || "", phone: current.phone || "", dob: current.dob || "" } : emptyForm);
      setImage(current ? localStorage.getItem(imageKey(current.email)) || "" : "");
      if (!current) setEditing(false);
    };
    load();
    window.addEventListener("homehub-auth-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("homehub-auth-changed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  // Get the latest details and the number of orders from the server
  useEffect(() => {
    if (!user) return;
    api.get("/user/me").then((res) => updateUser(res.data)).catch(() => {});
    api.get("/order/mine").then((res) => setOrderCount(res.data.length)).catch(() => {});
  }, [user?.id]);

  // Number of saved addresses (kept in this browser)
  let addressCount = 0;
  try {
    addressCount = JSON.parse(localStorage.getItem(`homehub-addresses-${user?.email?.toLowerCase()}`) || "[]").length;
  } catch {
    addressCount = 0;
  }

  const shown = (key) => (user ? user[key] || "Not available" : guest[key]);

  // Choose a new profile picture (saved in this browser)
  const handlePicture = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!user || !file) return;
    if (!file.type.startsWith("image/")) return alert("Please select a valid image.");
    if (file.size > 5 * 1024 * 1024) return alert("Please select an image smaller than 5MB.");

    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem(imageKey(user.email), reader.result);
        setImage(reader.result);
      } catch {
        alert("This image is too large to save. Please choose a smaller one.");
      }
    };
    reader.readAsDataURL(file);
  };

  const openPicker = () => (user ? fileInput.current?.click() : navigate("/login"));

  // Save the changes in the database (the email cannot be changed)
  const handleSave = async () => {
    if (!form.name.trim()) return setError("Please enter your name.");
    try {
      const { data } = await api.put("/user/me", form);
      updateUser(data);
      setEditing(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your profile.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", dob: user?.dob || "" });
  };

  // Quick info boxes: [label, value, icon, page to open]
  const quickInfo = [
    ["Total Orders", user ? orderCount : 0, Package, "/orders"],
    ["Wishlist Items", user ? wishlist.length : 0, Heart, "/wishlist"],
    ["Saved Addresses", user ? addressCount : 0, MapPin, "/addresses"],
    ["Loyalty Points", user ? 150 : 0, Star, null],
  ];

  return (
    <main className="profile-page">

      {/* ================= HERO ================= */}
      <section className="profile-hero">
        <div className="profile-hero-overlay">
          <div className="profile-hero-content">
            <div className="profile-breadcrumb">
              <span onClick={() => navigate("/")}>Home</span>
              <span>›</span>
              <span>Profile</span>
            </div>
            <h1><b>My Profile</b></h1>
            <p>Manage your account details, addresses and preferences all in one place.</p>
          </div>
        </div>
      </section>

      <section className="profile-main">
        <div className="profile-content-grid">

          {/* ================= LEFT ================= */}
          <div className="profile-left">

            {/* User card */}
            <div className="profile-user-card">
              <div className="profile-user-avatar">
                {image && user ? <img src={image} alt="Profile" /> : <User size={34} />}
              </div>
              <div className="profile-user-details">
                <h3>{shown("name")}</h3>
                <p>{shown("email")}</p>
              </div>
            </div>

            {/* Profile information */}
            <section className="profile-information-card">
              <div className="profile-card-header">
                <div className="profile-card-title">
                  <User size={21} />
                  <h2><b>Profile Information</b></h2>
                </div>
                {!editing && user && (
                  <button type="button" className="edit-profile-button" onClick={() => setEditing(true)}>
                    <Pencil size={17} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Profile picture */}
              <div className="profile-picture-section">
                <div className="profile-picture-wrapper">
                  <div className="profile-large-avatar">
                    {image && user ? <img src={image} alt="Profile" /> : <User size={52} />}
                  </div>
                  <button type="button" className="profile-camera-button" title="Change Profile Picture" onClick={openPicker}>
                    <Camera size={17} />
                  </button>
                </div>

                <div className="profile-picture-info">
                  <h3><b>Profile Picture</b></h3>
                  <p>JPG, PNG or WEBP. Maximum 5MB.</p>
                  <button type="button" className="change-profile-picture-button" onClick={openPicker}>
                    <Camera size={16} />
                    Change Profile Picture
                  </button>
                </div>
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePicture}
                style={{ display: "none" }}
              />

              {/* Fields */}
              <div className="profile-fields-grid">
                {fields.map(([key, label, Icon, type]) => (
                  <div className="profile-field" key={key}>
                    <div className="profile-field-icon"><Icon size={20} /></div>
                    <div className="profile-field-content">
                      <span>{label}</span>
                      {editing && key !== "email" ? (
                        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                      ) : (
                        <strong>{shown(key)}</strong>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {error && <p style={{ color: "#d23939", padding: "0 18px 12px", fontSize: "13px" }}>{error}</p>}

              {editing && user && (
                <div className="profile-edit-actions">
                  <button type="button" className="profile-cancel-button" onClick={handleCancel}>Cancel</button>
                  <button type="button" className="profile-save-button" onClick={handleSave}>Save Changes</button>
                </div>
              )}
            </section>

            {/* Quick info */}
            <section className="quick-info-card-section">
              <div className="quick-info-header">
                <div className="quick-info-title">
                  <Star size={20} />
                  <h2>Quick Info</h2>
                </div>
              </div>

              <div className="quick-info-grid">
                {quickInfo.map(([label, value, Icon, path]) => (
                  <div
                    className={path ? "quick-info-item clickable" : "quick-info-item"}
                    key={label}
                    onClick={path ? () => navigate(path) : undefined}
                  >
                    <div className="quick-info-icon"><Icon size={22} /></div>
                    <div>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ================= RIGHT: PROMO ================= */}
          <aside className="profile-promo">
            <div className="profile-promo-banner">
              <img src={CategoryOffer} alt="Home appliances" />
              <div className="profile-promo-overlay">
                <h2>
                  Upgrade Your Home<br />
                  with the <span>Best Electronics & Home Appliances</span>
                </h2>
                <p>Smart Choices • Better Living</p>
                <button type="button" onClick={() => navigate("/shop")}>
                  Shop Now
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <div className="profile-promo-categories">
              {shortcuts.map(([text, category, Icon]) => (
                <button type="button" key={text} onClick={() => navigate(`/shop?category=${encodeURIComponent(category)}`)}>
                  <Icon size={22} />
                  <span>{text}</span>
                </button>
              ))}
            </div>

            {!user && (
              <button type="button" onClick={() => navigate("/login")}>
                <LogIn size={18} />
                Login to Your Account
              </button>
            )}
          </aside>

        </div>
      </section>
    </main>
  );
}

export default Profile;