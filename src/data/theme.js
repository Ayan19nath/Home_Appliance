// Colour mode: "light", "dark" or "system" (follows the phone or computer setting)
const KEY = "homehub-theme";
const query = window.matchMedia("(prefers-color-scheme: dark)");

export const getTheme = () => {
  try {
    return localStorage.getItem(KEY) || "system";
  } catch {
    return "system";
  }
};

// Switch the page to dark or light colours
const apply = () => {
  const mode = getTheme();
  document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && query.matches));
};

export const setTheme = (mode) => {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    // ignore a full browser storage
  }
  apply();
};

// Run once when the website starts; the page follows the device setting while "system" is chosen
export const initTheme = () => {
  apply();
  query.addEventListener("change", apply);
};