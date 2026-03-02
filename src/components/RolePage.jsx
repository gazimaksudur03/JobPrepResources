import { useParams, NavLink, Navigate } from "react-router-dom";
import rolesConfig from "../rolesConfig";
import "./RolePage.css";

export default function RolePage() {
  const { roleId } = useParams();
  const role = rolesConfig.find((r) => r.id === roleId);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="role-page">
      <div className="role-header">
        <span className="role-icon">{role.icon}</span>
        <div>
          <h1>{role.title}</h1>
          <p className="role-description">{role.description}</p>
        </div>
      </div>

      <section className="role-topics">
        <h2>Recommended Topics</h2>
        <p className="role-topics-intro">
          Study the following topics to prepare for a <strong>{role.title}</strong> role.
        </p>
        <div className="role-topics-grid">
          {role.topics.map((topic) => (
            <NavLink
              key={topic.path}
              to={`/docs/${topic.path}`}
              className="role-topic-card"
            >
              <span className="role-topic-title">{topic.title}</span>
              <span className="role-topic-arrow">→</span>
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}
