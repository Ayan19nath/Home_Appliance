import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  MapPin,
  Plus,
  Home as HomeIcon,
  Pencil,
  Trash2,
  X,
  Check,
  User,
  Phone,
  Map,
} from "lucide-react";

import "./Addresses.css";


function Addresses() {

  const navigate = useNavigate();


  const [addresses, setAddresses] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);


  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });


  /* =========================================
     GET CURRENT USER
  ========================================= */

  const getCurrentUser = () => {

    const sessionUser =
      sessionStorage.getItem(
        "homehub-user"
      );


    const savedUser =
      localStorage.getItem(
        "homehub-user"
      );


    if (sessionUser) {

      try {

        const parsed =
          JSON.parse(sessionUser);

        if (parsed?.loggedIn) {
          return parsed;
        }

      } catch {
        // ignore
      }

    }


    if (savedUser) {

      try {

        const parsed =
          JSON.parse(savedUser);

        if (parsed?.loggedIn) {
          return parsed;
        }

      } catch {
        // ignore
      }

    }


    return null;
  };


  /* =========================================
     USER ADDRESS STORAGE KEY
  ========================================= */

  const getAddressKey = (user) => {

    if (!user?.email) {
      return "homehub-addresses-guest";
    }


    return `homehub-addresses-${user.email
      .trim()
      .toLowerCase()}`;
  };


  /* =========================================
     LOAD ADDRESSES
  ========================================= */

  const loadAddresses = () => {

    const currentUser =
      getCurrentUser();


    if (!currentUser) {

      navigate("/login");

      return;

    }


    const key =
      getAddressKey(
        currentUser
      );


    const savedAddresses =
      localStorage.getItem(key);


    if (!savedAddresses) {

      setAddresses([]);

      return;

    }


    try {

      const parsed =
        JSON.parse(
          savedAddresses
        );


      if (Array.isArray(parsed)) {

        setAddresses(
          parsed
        );

      } else {

        setAddresses([]);

      }

    } catch {

      setAddresses([]);

    }

  };


  useEffect(() => {

    loadAddresses();


    const handleAddressChanged = () => {
      loadAddresses();
    };


    window.addEventListener(
      "homehub-addresses-changed",
      handleAddressChanged
    );


    window.addEventListener(
      "storage",
      handleAddressChanged
    );


    return () => {

      window.removeEventListener(
        "homehub-addresses-changed",
        handleAddressChanged
      );


      window.removeEventListener(
        "storage",
        handleAddressChanged
      );

    };

  }, [navigate]);


  /* =========================================
     SAVE ADDRESSES
  ========================================= */

  const saveAddresses = (
    updatedAddresses
  ) => {

    const currentUser =
      getCurrentUser();


    if (!currentUser) {

      navigate("/login");

      return;

    }


    const key =
      getAddressKey(
        currentUser
      );


    localStorage.setItem(
      key,
      JSON.stringify(
        updatedAddresses
      )
    );


    setAddresses(
      updatedAddresses
    );


    window.dispatchEvent(
      new Event(
        "homehub-addresses-changed"
      )
    );

  };


  /* =========================================
     INPUT CHANGE
  ========================================= */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

  };


  /* =========================================
     ADD ADDRESS
  ========================================= */

  const handleAddAddress = () => {

    const currentUser =
      getCurrentUser();


    if (!currentUser) {

      navigate("/login");

      return;

    }


    setEditingId(null);


    setFormData({

      name:
        currentUser.name || "",

      phone:
        currentUser.phone || "",

      address: "",

      city: "",

      state: "",

      pincode: "",

      country: "India",

    });


    setShowForm(true);

  };


  /* =========================================
     EDIT ADDRESS
  ========================================= */

  const handleEdit = (
    address
  ) => {

    setEditingId(
      address.id
    );


    setFormData({

      name:
        address.name || "",

      phone:
        address.phone || "",

      address:
        address.address || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || "",

      country:
        address.country || "India",

    });


    setShowForm(true);

  };


  /* =========================================
     VALIDATE
  ========================================= */

  const validateForm = () => {

    if (!formData.name.trim()) {

      alert(
        "Please enter your name."
      );

      return false;

    }


    if (!formData.phone.trim()) {

      alert(
        "Please enter your phone number."
      );

      return false;

    }


    if (!formData.address.trim()) {

      alert(
        "Please enter your address."
      );

      return false;

    }


    if (!formData.city.trim()) {

      alert(
        "Please enter your city."
      );

      return false;

    }


    if (!formData.state.trim()) {

      alert(
        "Please enter your state."
      );

      return false;

    }


    if (!formData.pincode.trim()) {

      alert(
        "Please enter your pincode."
      );

      return false;

    }


    if (
      !/^\d{6}$/.test(
        formData.pincode.trim()
      )
    ) {

      alert(
        "Please enter a valid 6-digit pincode."
      );

      return false;

    }


    return true;

  };


  /* =========================================
     ADD / UPDATE
  ========================================= */

  const handleSubmit = (e) => {

    e.preventDefault();


    if (!validateForm()) {
      return;
    }


    const cleanedAddress = {

      name:
        formData.name.trim(),

      phone:
        formData.phone.trim(),

      address:
        formData.address.trim(),

      city:
        formData.city.trim(),

      state:
        formData.state.trim(),

      pincode:
        formData.pincode.trim(),

      country:
        formData.country.trim() ||
        "India",

    };


    /* =========================
       UPDATE
    ========================= */

    if (editingId !== null) {

      const updatedAddresses =
        addresses.map(
          (item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...cleanedAddress,
                }
              : item
        );


      saveAddresses(
        updatedAddresses
      );


      setShowForm(false);

      setEditingId(null);


      alert(
        "Address updated successfully."
      );


      return;

    }


    /* =========================
       ADD
    ========================= */

    const isFirstAddress =
      addresses.length === 0;


    const newAddress = {

      id:
        `ADDR${Date.now()}`,

      ...cleanedAddress,

      isDefault:
        isFirstAddress,

      default:
        isFirstAddress,

      createdAt:
        new Date().toISOString(),

    };


    const updatedAddresses = [

      ...addresses,

      newAddress,

    ];


    saveAddresses(
      updatedAddresses
    );


    setShowForm(false);


    setFormData({

      name: "",

      phone: "",

      address: "",

      city: "",

      state: "",

      pincode: "",

      country: "India",

    });


    alert(
      "Address saved successfully."
    );

  };


  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = (id) => {

    const addressToDelete =
      addresses.find(
        (item) =>
          item.id === id
      );


    if (!addressToDelete) {
      return;
    }


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this address?"
      );


    if (!confirmDelete) {
      return;
    }


    let updatedAddresses =
      addresses.filter(
        (item) =>
          item.id !== id
      );


    /* =========================
       DEFAULT ADDRESS DELETED
    ========================= */

    if (
      addressToDelete.isDefault ||
      addressToDelete.default
    ) {

      if (
        updatedAddresses.length >
        0
      ) {

        updatedAddresses =
          updatedAddresses.map(
            (item, index) => ({

              ...item,

              isDefault:
                index === 0,

              default:
                index === 0,

            })
          );

      }

    }


    saveAddresses(
      updatedAddresses
    );

  };


  /* =========================================
     SET DEFAULT
  ========================================= */

  const handleSetDefault = (
    id
  ) => {

    const updatedAddresses =
      addresses.map(
        (item) => ({

          ...item,

          isDefault:
            item.id === id,

          default:
            item.id === id,

        })
      );


    saveAddresses(
      updatedAddresses
    );

  };


  /* =========================================
     CLOSE FORM
  ========================================= */

  const handleCloseForm = () => {

    setShowForm(false);

    setEditingId(null);

  };


  return (

    <div className="addresses-page">

      {/* =====================================
          HERO
      ===================================== */}

      <section className="addresses-hero">

        <div className="addresses-hero-overlay">

          <div className="addresses-container">

            <div className="addresses-breadcrumb">

              <Link to="/">
                Home
              </Link>

              <span>
                ›
              </span>

              <span>
                Addresses
              </span>

            </div>


            <h1>
              My Addresses
            </h1>


            <p>
              Manage your saved addresses for faster and
              more convenient shopping.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN
      ===================================== */}

      <main className="addresses-main">

        <div className="addresses-container">

          <section className="addresses-card">

            {/* HEADER */}

            <div className="addresses-card-header">

              <div className="addresses-title-area">

                <div className="addresses-title-icon">

                  <MapPin size={34} />

                </div>


                <div>

                  <h2>
                    My Addresses
                  </h2>

                  <p>
                    Manage your delivery addresses
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="add-address-btn"
                onClick={
                  handleAddAddress
                }
              >

                <Plus size={21} />

                <span>
                  Add New Address
                </span>

              </button>

            </div>


            {/* =================================
                EMPTY STATE
            ================================= */}

            {addresses.length === 0 ? (

              <div className="addresses-empty">

                <div className="addresses-empty-icon">

                  <MapPin size={48} />

                </div>


                <h3>
                  No Address Saved
                </h3>


                <p>
                  You haven't added any delivery address yet.
                  Add your address for faster checkout.
                </p>


                <button
                  type="button"
                  className="empty-add-address-btn"
                  onClick={
                    handleAddAddress
                  }
                >

                  <Plus size={20} />

                  Add Your Address

                </button>

              </div>

            ) : (

              /* =================================
                 ADDRESS LIST
              ================================= */

              <div className="addresses-list">

                {addresses.map(
                  (item) => (

                    <article
                      className="address-item"
                      key={item.id}
                    >

                      <div className="address-home-icon">

                        <HomeIcon
                          size={31}
                        />

                      </div>


                      <div className="address-details">

                        <div className="address-name-row">

                          {(
                            item.isDefault ||
                            item.default
                          ) && (

                            <span className="default-address-badge">
                              Default
                            </span>

                          )}


                          <h3>
                            {item.name}
                          </h3>

                        </div>


                        <p className="address-phone">
                          {item.phone}
                        </p>


                        <p>
                          {item.address}
                        </p>


                        <p>
                          {item.city},{" "}
                          {item.state} -{" "}
                          {item.pincode}
                        </p>


                        <p>
                          {item.country}
                        </p>


                        {!(
                          item.isDefault ||
                          item.default
                        ) && (

                          <button
                            type="button"
                            className="set-default-btn"
                            onClick={() =>
                              handleSetDefault(
                                item.id
                              )
                            }
                          >

                            <Check size={15} />

                            Set as Default

                          </button>

                        )}

                      </div>


                      <div className="address-actions">

                        <button
                          type="button"
                          className="address-action-btn"
                          onClick={() =>
                            handleEdit(
                              item
                            )
                          }
                        >

                          <Pencil size={19} />

                          <span>
                            Edit
                          </span>

                        </button>


                        <button
                          type="button"
                          className="address-action-btn delete-address-action"
                          onClick={() =>
                            handleDelete(
                              item.id
                            )
                          }
                        >

                          <Trash2
                            size={19}
                          />

                          <span>
                            Remove
                          </span>

                        </button>

                      </div>

                    </article>

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </main>


      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showForm && (

        <div
          className="address-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target.classList.contains(
                "address-modal-overlay"
              )
            ) {

              handleCloseForm();

            }

          }}
        >

          <div className="address-modal">

            <div className="address-modal-header">

              <div>

                <h2>

                  {editingId !== null
                    ? "Edit Address"
                    : "Add New Address"}

                </h2>


                <p>
                  Enter your delivery details below
                </p>

              </div>


              <button
                type="button"
                className="address-modal-close"
                onClick={
                  handleCloseForm
                }
                aria-label="Close"
              >

                <X size={23} />

              </button>

            </div>


            <form
              className="address-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="address-form-group">

                <label htmlFor="name">
                  Full Name
                </label>

                <div className="address-input-wrapper">

                  <User size={18} />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                  />

                </div>

              </div>


              <div className="address-form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="address-input-wrapper">

                  <Phone size={18} />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                  />

                </div>

              </div>


              <div className="address-form-group full-width">

                <label htmlFor="address">
                  Complete Address
                </label>

                <div className="address-input-wrapper address-textarea-wrapper">

                  <Map size={18} />

                  <textarea
                    id="address"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Flat / Road / Area"
                    rows="3"
                  />

                </div>

              </div>


              <div className="address-form-group">

                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  name="city"
                  value={
                    formData.city
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter city"
                />

              </div>


              <div className="address-form-group">

                <label htmlFor="state">
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  name="state"
                  value={
                    formData.state
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter state"
                />

              </div>


              <div className="address-form-group">

                <label htmlFor="pincode">
                  Pincode
                </label>

                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  value={
                    formData.pincode
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="6-digit pincode"
                  maxLength="6"
                />

              </div>


              <div className="address-form-group">

                <label htmlFor="country">
                  Country
                </label>

                <input
                  id="country"
                  type="text"
                  name="country"
                  value={
                    formData.country
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Country"
                />

              </div>


              <div className="address-form-actions">

                <button
                  type="button"
                  className="address-cancel-btn"
                  onClick={
                    handleCloseForm
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="address-save-btn"
                >

                  <Check size={19} />

                  {editingId !== null
                    ? "Update Address"
                    : "Save Address"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}


export default Addresses;