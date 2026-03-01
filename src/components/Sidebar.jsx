import { NavLink } from "react-router-dom";
import docsConfig from "../docsConfig";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand">
          📚 Job Prep Resources
        </NavLink>
      </div>
      <nav className="sidebar-nav">
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
                  >
                    {page.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
