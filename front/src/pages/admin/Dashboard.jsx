import "./Dashboard.css";
import { useState } from "react";
import Users from "./Users.jsx";
import Videos from "./Videos.jsx";
import JuryMembers from "./JuryMembers.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import {
  MAX_SUPPORTS,
  MIN_SUPPORTS,
  createEmptySupport,
  getSupports,
  saveSupports,
} from "../../utils/supportsStorage.js";

function Dashboard() {
  const { tr } = useLanguage();
  const [supports, setSupports] = useState(() => getSupports());

  const updateSupportField = (id, field, value) => {
    const nextSupports = supports.map((support) =>
      support.id === id ? { ...support, [field]: value } : support,
    );

    setSupports(nextSupports);
    saveSupports(nextSupports);
  };

  const addSupport = () => {
    if (supports.length >= MAX_SUPPORTS) {
      return;
    }

    const nextSupports = [...supports, createEmptySupport(supports.length)];
    setSupports(nextSupports);
    saveSupports(nextSupports);
  };

  const removeSupport = (id) => {
    if (supports.length <= MIN_SUPPORTS) {
      return;
    }

    const nextSupports = supports.filter((support) => support.id !== id);
    setSupports(nextSupports);
    saveSupports(nextSupports);
  };

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

      <section id="jury-members" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>{tr("Gestion des membres du jury", "Jury members management")}</h3>
          <span>{tr("Section actuelle", "Current section")}</span>
        </div>
        <JuryMembers />
      </section>

      <section id="supports" className="dashboard-section">
        <div className="dashboard-section-title">
          <h3>{tr("Gestion des soutiens", "Supporters management")}</h3>
          <span>{supports.length}/{MAX_SUPPORTS}</span>
        </div>

        <p className="dashboard-supports-help">
          {tr(
            "Configurez les soutiens affichés sur la Home (de 1 à 12).",
            "Configure the supporters displayed on Home (from 1 to 12).",
          )}
        </p>

        <div className="dashboard-supports-toolbar">
          <button type="button" onClick={addSupport} disabled={supports.length >= MAX_SUPPORTS}>
            {tr("Ajouter un soutien", "Add supporter")}
          </button>
          <p>
            {tr("Astuce: laissez l'image vide pour afficher le placeholder.", "Tip: leave image empty to show the placeholder.")}
          </p>
        </div>

        <div className="dashboard-supports-grid">
          {supports.map((support, index) => (
            <article key={support.id} className="dashboard-support-card">
              <div className="dashboard-support-card-head">
                <h4>{tr("Soutien", "Supporter")} #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSupport(support.id)}
                  disabled={supports.length <= MIN_SUPPORTS}
                >
                  {tr("Supprimer", "Remove")}
                </button>
              </div>

              <label htmlFor={`support-name-${support.id}`}>{tr("Nom", "Name")}</label>
              <input
                id={`support-name-${support.id}`}
                type="text"
                value={support.name}
                onChange={(event) => updateSupportField(support.id, "name", event.target.value)}
                placeholder={tr("Ex: La Plateforme", "E.g.: La Plateforme")}
              />

              <label htmlFor={`support-image-${support.id}`}>{tr("URL image", "Image URL")}</label>
              <input
                id={`support-image-${support.id}`}
                type="url"
                value={support.imageUrl}
                onChange={(event) => updateSupportField(support.id, "imageUrl", event.target.value)}
                placeholder="https://..."
              />

              <label htmlFor={`support-link-${support.id}`}>{tr("URL site", "Website URL")}</label>
              <input
                id={`support-link-${support.id}`}
                type="url"
                value={support.websiteUrl}
                onChange={(event) => updateSupportField(support.id, "websiteUrl", event.target.value)}
                placeholder="https://..."
              />
            </article>
          ))}
        </div>
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