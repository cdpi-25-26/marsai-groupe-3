import "./Dashboard.css";
import Users from "./Users.jsx";
import Videos from "./Videos.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Dashboard() {
  const { tr } = useLanguage();
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">{tr("Panneau d'administration", "Administration panel")}</p>
          <h2>{tr("Vue d'ensemble", "Overview")}</h2>
          <p className="dashboard-subtitle">
            {tr("Gérez vos contenus existants et préparez les prochaines sections admin depuis cet espace.", "Manage existing content and prepare upcoming admin sections from this area.")}
          </p>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <p>{tr("Utilisateurs", "Users")}</p>
            <strong>{tr("Gestion active", "Active management")}</strong>
          </article>
          <article className="stat-card">
            <p>{tr("Vidéos", "Videos")}</p>
            <strong>{tr("Catalogue connecté", "Connected catalog")}</strong>
          </article>
          <article className="stat-card">
            <p>{tr("Prochainement", "Soon")}</p>
            <strong>{tr("Nouvelles sections", "New sections")}</strong>
          </article>
        </div>
      </header>

      <section id="users" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>{tr("Gestion des utilisateurs", "User management")}</h3>
          <span>{tr("Section actuelle", "Current section")}</span>
        </div>
        <Users />
      </section>

      <section id="videos" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>{tr("Gestion des vidéos", "Video management")}</h3>
          <span>{tr("Section actuelle", "Current section")}</span>
        </div>
        <Videos />
      </section>

      <section id="future-sections" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>{tr("Modules admin à ajouter", "Upcoming admin modules")}</h3>
          <span>{tr("Prochaine structure", "Next structure")}</span>
        </div>

        <div className="future-grid">
          <article className="future-card">{tr("Événements", "Events")}</article>
          <article className="future-card">{tr("Catégories", "Categories")}</article>
          <article className="future-card">{tr("Réservations", "Bookings")}</article>
          <article className="future-card">{tr("Récompenses", "Awards")}</article>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;