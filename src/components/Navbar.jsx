import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
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
    </header>
  );
}
