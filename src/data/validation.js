// Returns a message if the password is too weak, or "" if it is fine
export const passwordProblem = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[A-Za-z]/.test(password)) return "Password must contain at least one letter.";
  if (!/\d/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
  return "";
};

export const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());