// Customer login state. "session" lasts for this browser tab, "local" is the "Remember me" login.
const KEY = "homehub-user";
const ADMIN_KEYS = ["adminToken", "adminRole", "adminOwner"];
const tell = () => window.dispatchEvent(new Event("homehub-auth-changed")); // the Navbar and pages refresh

// Logged-in customer ({ id, name, email, phone, dob, token }) or null
export const getUser = () => {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const user = JSON.parse(store.getItem(KEY));
      if (user?.loggedIn) return user;
    } catch {
      // ignore invalid saved data
    }
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

// Update the saved details after the profile is edited
export const updateUser = (changes) => {
  const store = sessionStorage.getItem(KEY) ? sessionStorage : localStorage;
  try {
    store.setItem(KEY, JSON.stringify({ ...JSON.parse(store.getItem(KEY)), ...changes }));
    tell();
  } catch {
    // ignore invalid saved data
  }
};