import { NavLink } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import "./Navbar.css";

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <button
        className="navbar-toggle"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={sidebarOpen}
      >
        <span className={`hamburger${sidebarOpen ? " hamburger--open" : ""}`}>
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </span>
      </button>
      <NavLink to="/" className="navbar-brand">
        📚 Job Prep Resources
      </NavLink>
      <button
        className="navbar-theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
