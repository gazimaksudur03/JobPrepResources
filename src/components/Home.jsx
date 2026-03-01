import { NavLink } from "react-router-dom";
import docsConfig from "../docsConfig";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Job Prep Resources</h1>
        <p>
          A curated collection of guides and references to help you prepare for
          IT job interviews. Browse topics from the sidebar or pick a section
          below.
        </p>
      </div>
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
    </div>
  );
}
