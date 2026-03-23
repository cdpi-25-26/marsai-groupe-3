import "./Programme.css";
import { useState } from "react";
import { createReservation } from "../../api/reservations";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import agendaIcon from "../../assets/icones/icones_programme/agenda.svg";
import mapPlateformeIcon from "../../assets/icones/icones_programme/map_plateforme.svg";
import horlogeIcon from "../../assets/icones/icones_programme/horloge.svg";
import flecheAccesIcon from "../../assets/icones/icones_programme/fleche_acces.svg";
import tramwayIcon from "../../assets/icones/icones_programme/tramway.svg";
import voitureIcon from "../../assets/icones/icones_programme/voiture.svg";
import mapAccesIcon from "../../assets/icones/icones_programme/map_acces.svg";
import workshopIcon from "../../assets/icones/icones_programme/worshop.svg";
import atelierPratiqueIcon from "../../assets/icones/icones_programme/atelier_pratique.svg";

export default function Programme() {
  const { tr } = useLanguage();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    participants: [{ firstName: "", lastName: "", email: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", message: string }

  const openModal = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const closeModal = () => {
    setSelectedWorkshop(null);
    setFormData({ participants: [{ firstName: "", lastName: "", email: "" }] });
  };

  const handleParticipantChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, { firstName: "", lastName: "", email: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWorkshop) return;
    setIsSubmitting(true);

    try {
      await Promise.all(
        formData.participants.map((p) =>
          createReservation({
            surname: p.lastName,
            name: p.firstName,
            email: p.email,
            id_event: null, // à raccorder quand les id_event seront connus
          }),
        ),
      );
      setFeedback({
        type: "success",
        message: tr("Réservation envoyée !", "Reservation sent!"),
      });
      closeModal();
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        tr("Erreur lors de l'envoi. Vérifiez le backend.", "Error while sending. Please check the backend.");
      setFeedback({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessions = [
    {
      time: "9h30",
      title: "SOCIAL",
      desc: tr("Accueil & Café Networking", "Welcome & Networking Coffee"),
      color: "#6ee7b7",
    },
    {
      time: "10h30",
      title: "KEYNOTE",
      desc: tr("Conférence d'ouverture : L'IA au service du Cinéma", "Opening keynote: AI in service of cinema"),
      color: "#a855f7",
    },
    {
      time: "13h00",
      title: "BREAK",
      desc: tr("Déjeuner Libre", "Free lunch"),
      color: "#9ca3af",
    },
    {
      time: "14h30",
      title: "CINEMA",
      desc: tr("Projection Sélection Officielle", "Official selection screening"),
      color: "#ff66b2",
    },
    {
      time: "16h30",
      title: "TALK",
      desc: tr("Table Ronde : Futurs Souhaitables", "Round table: desirable futures"),
      color: "#ffffff",
    },
    {
      time: "19h00",
      title: "AWARDS",
      desc: tr("Grand prix & Cérémonie de Clôture", "Grand prize & closing ceremony"),
      color: "#fbbf24",
    },
    {
      time: "21h00",
      title: "PARTY",
      desc: tr("MARS.A.I Night - DJ Set Immersif", "MARS.A.I Night - Immersive DJ set"),
      color: "#60a5fa",
    },
  ];

  const workshops = [
    {
      time: "14h30",
      title: "GENERATION VIDEO: LES BASES",
      desc: tr("COACH : THOMAS AUBERT.", "COACH: THOMAS AUBERT."),
    },
    {
      time: "15h45",
      title: "IA & SCENARIO : CO-ECRITURE",
      desc: tr("COACH : THOMAS AUBERT.", "COACH: THOMAS AUBERT."),
    },
    {
      time: "17h00",
      title: "POST-PROD IA & EFFETS SPECIAUX",
      desc: tr("COACH : THOMAS AUBERT.", "COACH: THOMAS AUBERT."),
    },
    {
      time: "18h15",
      title: "ETHIQUE & DROIT DE L'IA",
      desc: tr("COACH : NICOLAS LAMBERT.", "COACH: NICOLAS LAMBERT."),
    },
  ];

  return (
    <section className="programme-page">
      <div className="programme-head">
        <img src={agendaIcon} alt="" className="programme-icon" aria-hidden="true" />
        <span className="programme-label">{tr("infos pratiques", "practical info")}</span>
      </div>

      <h1 className="programme-date">{tr("13 juin 2026", "June 13, 2026")}</h1>
      <p className="programme-city">MARSEILLE</p>

      <div className="programme-card">
        <div className="card-header">
          <div className="card-icon-box">
            <img src={mapPlateformeIcon} alt="" className="card-icon" aria-hidden="true" />
          </div>
          <div className="card-title">La Plateforme_</div>
        </div>
        <div className="card-sub">
          {tr(
            "L'épicentre de la révolution créative marseillaise. 4000m² dédiés à l'image et au futur.",
            "The epicenter of Marseille's creative revolution. 4000m² dedicated to imagery and the future."
          )}
        </div>
      </div>

      <div className="conf-block">
        <div className="conf-header">
          <img src={horlogeIcon} alt="" className="conf-icon" aria-hidden="true" />
          <h2 className="conf-title">{tr("PROGRAMME DES CONFÉRENCES", "CONFERENCE PROGRAM")}</h2>
        </div>
        <div className="conf-underline"></div>
      </div>

      <div className="conf-list">
        {sessions.map((session) => (
          <div className="conf-item" key={session.time}>
            <span className="conf-time" style={{ color: session.color }}>
              {session.time}
            </span>
            <div className="conf-text">
              <span className="conf-name" style={{ color: session.color }}>
                {session.title}
              </span>
              <p className="conf-desc">{session.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="conf-block access-block">
        <div className="conf-header">
          <img src={flecheAccesIcon} alt="" className="access-icon" aria-hidden="true" />
          <h2 className="conf-title">{tr("ACCES", "ACCESS")}</h2>
        </div>
        <div className="conf-underline access-underline"></div>
      </div>

      <div className="access-inline">
        <div className="access-square" aria-hidden="true">
          <img src={tramwayIcon} alt="" className="access-square-icon" />
        </div>
        <div className="access-text">
          <div className="access-title">{tr("Transports en commun", "Public transport")}</div>
          <p className="access-desc">
            {tr("Tram T2 / T3 - Arrêt Arenc Le Silo.", "Tram T2 / T3 - Arenc Le Silo stop.")}<br />
            {tr("Métro M2 - Station Désirée Clary.", "Metro M2 - Désirée Clary station.")}
          </p>
        </div>
      </div>

      <div className="access-inline">
        <div className="access-square access-square-green" aria-hidden="true">
          <img src={voitureIcon} alt="" className="access-square-icon" />
        </div>
        <div className="access-text">
          <div className="access-title">{tr("Voiture", "Car")}</div>
          <p className="access-desc">
            {tr("Autoroute A55 - Sortie 2.", "A55 highway - Exit 2.")}<br />
            {tr("Parking Indigo Quai du Lazaret à 200m.", "Indigo Quai du Lazaret parking at 200m.")}
          </p>
        </div>
      </div>

      <div className="access-inline">
        <div className="access-square access-square-purple" aria-hidden="true">
          <img src={mapAccesIcon} alt="" className="access-square-icon" />
        </div>
        <div className="access-text">
          <div className="access-title">{tr("Adresse", "Address")}</div>
          <p className="access-desc">
            {tr("12 Rue d'Uzes, 13002 Marseille (Entrée Principale).", "12 Rue d'Uzes, 13002 Marseille (Main entrance).")}
          </p>
        </div>
      </div>

      <div className="map-wrapper">
        <iframe
          title="Localisation La Plateforme_"
          src="https://www.google.com/maps?q=La+Plateforme,+12+Rue+d%27Uz%C3%A8s+13002+Marseille&hl=fr&z=17&output=embed"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="conf-block workshops-block">
        <div className="conf-header">
          <img src={atelierPratiqueIcon} alt="" className="workshop-icon" aria-hidden="true" />
          <h2 className="conf-title">{tr("ATELIERS PRATIQUES", "HANDS-ON WORKSHOPS")}</h2>
        </div>
        <div className="conf-underline workshop-underline"></div>
      </div>

      <div className="workshops-panel">
        <div className="workshops-header">
          <div className="workshops-title">
            <span className="ws-title-main">{tr("WORSHOPS", "WORKSHOPS")}</span>
            <span className="ws-title-sub">{tr("IA CREATIVE", "CREATIVE AI")}</span>
          </div>
          <img src={workshopIcon} alt="" className="workshops-icon" aria-hidden="true" />
        </div>
        <p className="workshops-lead">
          {tr("Passez de la théorie à la pratique avec les meilleurs experts internationaux. Attention, places limitées (max 15 par session).", "Move from theory to practice with leading international experts. Warning: limited seats (max 15 per session).")}
        </p>

        <div className="workshops-grid">
          {workshops.map((w) => (
            <div className="workshop-card" key={w.time + w.title}>
              <span className="workshop-time">{w.time}</span>
              <div className="workshop-card-title">{w.title}</div>
              <p className="workshop-card-desc">{w.desc}</p>
              <button
                className="workshop-btn"
                onClick={() => openModal(w)}
              >
                {tr("RESERVER MA PLACE", "BOOK MY SEAT")}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedWorkshop && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-header">
              <div>
                <div className="modal-kicker">{tr("Atelier", "Workshop")}</div>
                <h3 id="modal-title" className="modal-title">
                  {selectedWorkshop.title}
                </h3>
                <div className="modal-time">{selectedWorkshop.time}</div>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label={tr("Fermer", "Close")}>
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              {formData.participants.map((p, index) => (
                <div className="modal-row" key={index}>
                  <label className="modal-label">
                    {tr("Prénom", "First name")}
                    <input
                      type="text"
                      value={p.firstName}
                      onChange={(e) => handleParticipantChange(index, "firstName", e.target.value)}
                      placeholder={tr("Votre prénom", "Your first name")}
                      required
                    />
                  </label>
                  <label className="modal-label">
                    {tr("Nom", "Last name")}
                    <input
                      type="text"
                      value={p.lastName}
                      onChange={(e) => handleParticipantChange(index, "lastName", e.target.value)}
                      placeholder={tr("Votre nom", "Your last name")}
                      required
                    />
                  </label>
                  <label className="modal-label">
                    Email
                    <input
                      type="email"
                      value={p.email}
                      onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                      placeholder={tr("nom@exemple.com", "name@example.com")}
                      required
                    />
                  </label>
                </div>
              ))}

              <button type="button" className="modal-add" onClick={addParticipant}>
                + {tr("Ajouter un participant", "Add a participant")}
              </button>

              <div className="modal-actions">
                <button type="submit" className="modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? tr("Envoi...", "Sending...") : tr("Envoyer", "Send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`toast ${feedback.type}`}>
          <span className="toast-dot" aria-hidden="true"></span>
          <span className="toast-text">{feedback.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => setFeedback(null)}
          >
            OK
          </button>
        </div>
      )}
    </section>
  );
}
