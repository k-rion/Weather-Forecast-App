import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme === "dark" ? "forest" : "light");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      console.log("");
    }
  }, [theme]);

  function toggle() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="p-2 rounded focus:outline-none dark:bg-gray-800/30 text-2xl"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}