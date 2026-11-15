// Customer login state. "local" stays after the browser closes, "session" lasts only for this tab.
const KEY = "homehub-user";
const ADMIN_KEYS = ["adminToken", "adminRole", "adminOwner", "adminUser"];
const tell = () => window.dispatchEvent(new Event("homehub-auth-changed")); // the Navbar and pages refresh

// Logged-in customer ({ id, name, email, phone, dob, token }) or null.
// An admin can shop too: when no customer is logged in, the admin profile saved at login is used.
export const getUser = () => {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const user = JSON.parse(store.getItem(KEY));
      if (user?.loggedIn) return user;
    } catch {
      // ignore invalid saved data
    }
  }
  try {
    const admin = JSON.parse(localStorage.getItem("adminUser"));
    const token = localStorage.getItem("adminToken");
    if (admin && token) return { ...admin, token, loggedIn: true };
  } catch {
    // ignore invalid saved data
  }
  return null;
};

// Log the customer out
export const clearUser = () => {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
  tell();
};

// Log the admin out
export const clearAdmin = () => ADMIN_KEYS.forEach((key) => localStorage.removeItem(key));

// Save a new login (one login at a time, so an admin login is removed)
export const saveUser = (user, remember) => {
  clearUser();
  clearAdmin();
  (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify({ ...user, loggedIn: true }));
  tell();
};

// Update the saved details after the profile is edited (customer, or the admin when an admin is shopping)
export const updateUser = (changes) => {
  try {
    const store = sessionStorage.getItem(KEY) ? sessionStorage : localStorage;
    const saved = JSON.parse(store.getItem(KEY));
    if (saved?.loggedIn) {
      store.setItem(KEY, JSON.stringify({ ...saved, ...changes }));
      return tell();
    }
    const admin = JSON.parse(localStorage.getItem("adminUser"));
    if (admin) {
      localStorage.setItem("adminUser", JSON.stringify({ ...admin, ...changes }));
      tell();
    }
  } catch {
    // ignore invalid saved data
  }
};

// Replace the saved login token with a renewed one (nothing on the page changes)
export const renewToken = (token) => {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const user = JSON.parse(store.getItem(KEY));
      if (user?.loggedIn) return store.setItem(KEY, JSON.stringify({ ...user, token }));
    } catch {
      // ignore invalid saved data
    }
  }
  if (localStorage.getItem("adminToken")) localStorage.setItem("adminToken", token);
};