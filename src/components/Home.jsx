import { NavLink } from "react-router-dom";
import docsConfig from "../docsConfig";
import rolesConfig from "../rolesConfig";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Job Prep Resources</h1>
        <p>
          A curated collection of guides and references to help you prepare for
          IT job interviews. Prepare by role or browse individual topics below.
        </p>
      </div>

      <section className="home-section">
        <h2 className="home-section-title">
          <span className="home-section-icon">🎯</span> Prepare by Role
        </h2>
        <div className="home-roles-grid">
          {rolesConfig.map((role) => (
            <NavLink
              key={role.id}
              to={`/roles/${role.id}`}
              className="home-role-card"
            >
              <span className="home-role-icon">{role.icon}</span>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <span className="home-role-cta">
                View topics <span aria-hidden="true">→</span>
              </span>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">
          <span className="home-section-icon">📖</span> Browse by Topic
        </h2>
        <div className="home-grid">
          {docsConfig.map((section) => (
            <div key={section.category} className="home-card">
              <h2>{section.category}</h2>
              <ul>
                {section.pages.map((page) => (
                  <li key={page.path}>
                    <NavLink to={`/docs/${page.path}`}>{page.title}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
