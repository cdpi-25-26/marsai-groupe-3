import "./Dashboard.css";
import Users from "./Users.jsx";
import Videos from "./Videos.jsx";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Panneau d&apos;administration</p>
          <h2>Vue d&apos;ensemble</h2>
          <p className="dashboard-subtitle">
            Gérez vos contenus existants et préparez les prochaines sections
            admin depuis cet espace.
          </p>
        </div>

        <div className="dashboard-stats">
          <article className="stat-card">
            <p>Utilisateurs</p>
            <strong>Gestion active</strong>
          </article>
          <article className="stat-card">
            <p>Vidéos</p>
            <strong>Catalogue connecté</strong>
          </article>
          <article className="stat-card">
            <p>Prochainement</p>
            <strong>Nouvelles sections</strong>
          </article>
        </div>
      </header>

      <section id="users" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>Gestion des utilisateurs</h3>
          <span>Section actuelle</span>
        </div>
        <Users />
      </section>

      <section id="videos" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>Gestion des vidéos</h3>
          <span>Section actuelle</span>
        </div>
        <Videos />
      </section>

      <section id="future-sections" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>Modules admin à ajouter</h3>
          <span>Structure prête</span>
        </div>

        <div className="future-grid">
          <article className="future-card">Événements</article>
          <article className="future-card">Catégories</article>
          <article className="future-card">Réservations</article>
          <article className="future-card">Récompenses</article>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;