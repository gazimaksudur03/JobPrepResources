import { NavLink } from "react-router-dom";
import { useTheme } from "../context/useTheme";
import docsConfig from "../docsConfig";
import rolesConfig from "../rolesConfig";
import "./Sidebar.css";

export default function Sidebar({ open, onNavigate }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`sidebar${open ? " sidebar--open" : ""}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand" onClick={onNavigate}>
          📚 Job Prep Resources
        </NavLink>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-group-label">Browse by Role</div>
        {rolesConfig.map((role) => (
          <div key={role.id} className="sidebar-section">
            <ul className="sidebar-list">
              <li>
                <NavLink
                  to={`/roles/${role.id}`}
                  className={({ isActive }) =>
                    `sidebar-link sidebar-role-link${isActive ? " active" : ""}`
                  }
                  onClick={onNavigate}
                >
                  <span className="sidebar-role-icon">{role.icon}</span>
                  {role.title}
                </NavLink>
              </li>
            </ul>
          </div>
        ))}

        <div className="sidebar-divider" />

        <div className="sidebar-group-label">Browse by Topic</div>
        {docsConfig.map((section) => (
          <div key={section.category} className="sidebar-section">
            <h3 className="sidebar-section-title">{section.category}</h3>
            <ul className="sidebar-list">
              {section.pages.map((page) => (
                <li key={page.path}>
                  <NavLink
                    to={`/docs/${page.path}`}
                    className={({ isActive }) =>
                      `sidebar-link${isActive ? " active" : ""}`
                    }
                    onClick={onNavigate}
                  >
                    {page.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="theme-toggle-icon">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
