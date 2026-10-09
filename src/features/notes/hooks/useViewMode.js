import { useState } from "react";

// grid / list choice is remembered in localStorage
export function useViewMode() {
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem("notes-view") || "grid";
    } catch {
      return "grid";
    }
  });

  const changeView = (value) => {
    setView(value);
    try {
      localStorage.setItem("notes-view", value);
    } catch {
      // ignore
    }
  };

  return [view, changeView];
}
