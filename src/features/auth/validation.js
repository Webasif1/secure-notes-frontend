// same rules as the backend validators, checked before sending
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const splitInterests = (text) =>
  text
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
