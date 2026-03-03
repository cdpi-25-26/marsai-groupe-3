import "./Programme.css";
import { useState } from "react";
import { createReservation } from "../../api/reservations";
import { createReservation } from "../../api/reservations";
import agendaIcon from "../../assets/icones/icones_programme/agenda.svg";
import mapPlateformeIcon from "../../assets/icones/icones_programme/map_plateforme.svg";
import horlogeIcon from "../../assets/icones/icones_programme/horloge.svg";
import flecheAccesIcon from "../../assets/icones/icones_programme/fleche_acces.svg";
import tramwayIcon from "../../assets/icones/icones_programme/tramway.svg";
import voitureIcon from "../../assets/icones/icones_programme/voiture.svg";
import mapAccesIcon from "../../assets/icones/icones_programme/map_acces.svg";
import atelierPratiqueIcon from "../../assets/icones/icones_programme/atelier_pratique.svg";
import worshopIcon from "../../assets/icones/icones_programme/worshop.svg";

export default function Programme() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    participants: [{ firstName: "", lastName: "", email: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      alert("Réservation envoyée !");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi. Vérifiez le backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sessions = [
    {
      time: "9h30",
      title: "SOCIAL",
      desc: "Accueil & Café Networking",
      color: "#6ee7b7",
    },
    {
      time: "10h30",
      title: "KEYNOTE",
      desc: "Conférence d'ouverture : L'IA au service du Cinéma",
      color: "#a855f7",
    },
    {
      time: "13h00",
      title: "BREAK",
      desc: "Déjeuner Libre",
      color: "#9ca3af",
    },
    {
      time: "14h30",
      title: "CINEMA",
      desc: "Projection Sélection Officielle",
      color: "#ff66b2",
    },
    {
      time: "16h30",
      title: "TALK",
      desc: "Table Ronde : Futurs Souhaitables",
      color: "#ffffff",
    },
    {
      time: "19h00",
      title: "AWARDS",
      desc: "Grand prix & Cérémonie de Clôture",
      color: "#fbbf24",
    },
    {
      time: "21h00",
      title: "PARTY",
      desc: "MARS.A.I Night - DJ Set Immersif",
      color: "#60a5fa",
    },
  ];

  const workshops = [
    {
      time: "14h30",
      title: "GENERATION VIDEO: LES BASES",
      desc: "COACH : THOMAS AUBERT.",
    },
    {
      time: "15h45",
      title: "IA & SCENARIO : CO-ECRITURE",
      desc: "COACH : THOMAS AUBERT.",
    },
    {
      time: "17h00",
      title: "POST-PROD IA & EFFETS SPECIAUX",
      desc: "COACH : THOMAS AUBERT.",
    },
    {
      time: "18h15",
      title: "ETHIQUE & DROIT DE L'IA",
      desc: "COACH : NICOLAS LAMBERT.",
    },
  ];

  return (
    <section className="programme-page">
      <div className="programme-head">
        <img src={agendaIcon} alt="" className="programme-icon" aria-hidden="true" />
        <span className="programme-label">infos pratiques</span>
      </div>

      <h1 className="programme-date">13 juin 2026</h1>
      <p className="programme-city">MARSEILLE</p>

      <div className="programme-card">
        <div className="card-header">
          <div className="card-icon-box">
            <img src={mapPlateformeIcon} alt="" className="card-icon" aria-hidden="true" />
          </div>
          <div className="card-title">La Plateforme_</div>
        </div>
        <div className="card-sub">
          L&apos;épicentre de la révolution créative marseillaise. 4000m² dédiés
          à l&apos;image et au futur.
        </div>
      </div>

      <div className="conf-block">
        <div className="conf-header">
          <img src={horlogeIcon} alt="" className="conf-icon" aria-hidden="true" />
          <h2 className="conf-title">PROGRAMME DES CONFÉRENCES</h2>
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
          <h2 className="conf-title">ACCES</h2>
        </div>
        <div className="conf-underline access-underline"></div>
      </div>

      <div className="access-inline">
        <div className="access-square" aria-hidden="true">
          <img src={tramwayIcon} alt="" className="access-square-icon" />
        </div>
        <div className="access-text">
          <div className="access-title">Transports en commun</div>
          <p className="access-desc">
            Tram T2 / T3 - Arrêt Arenc Le Silo.<br />
            Métro M2 - Station Désirée Clary.
          </p>
        </div>
      </div>

      <div className="access-inline">
        <div className="access-square access-square-green" aria-hidden="true">
          <img src={voitureIcon} alt="" className="access-square-icon" />
        </div>
        <div className="access-text">
          <div className="access-title">Voiture</div>
          <p className="access-desc">
            Autoroute A55 - Sortie 2.<br />
            Parking Indigo Quai du Lazaret à 200m.
          </p>
        </div>
      </div>

      <div className="access-inline">
        <div className="access-square access-square-purple" aria-hidden="true">
          <img src={mapAccesIcon} alt="" className="access-square-icon" />
        </div>
        <div className="access-text">
          <div className="access-title">Adresse</div>
          <p className="access-desc">
            12 Rue d&apos;Uzes, 13002 Marseille (Entrée Principale).
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
          <h2 className="conf-title">ATELIERS PRATIQUES</h2>
        </div>
        <div className="conf-underline workshop-underline"></div>
      </div>

      <div className="workshops-panel">
        <div className="workshops-header">
          <div className="workshops-title">
            <span className="ws-title-main">WORSHOPS</span>
            <span className="ws-title-sub">IA CREATIVE</span>
          </div>
          <img src={worshopIcon} alt="" className="workshops-icon" aria-hidden="true" />
        </div>
        <p className="workshops-lead">
          Passez de la théorie à la pratique avec les meilleurs experts internationaux. Attention, places limitées (max 15 par session).
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
                RESERVER MA PLACE
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
                <div className="modal-kicker">Atelier</div>
                <h3 id="modal-title" className="modal-title">
                  {selectedWorkshop.title}
                </h3>
                <div className="modal-time">{selectedWorkshop.time}</div>
              </div>
              <button className="modal-close" onClick={closeModal} aria-label="Fermer">
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              {formData.participants.map((p, index) => (
                <div className="modal-row" key={index}>
                  <label className="modal-label">
                    Prénom
                    <input
                      type="text"
                      value={p.firstName}
                      onChange={(e) => handleParticipantChange(index, "firstName", e.target.value)}
                      placeholder="Votre prénom"
                      required
                    />
                  </label>
                  <label className="modal-label">
                    Nom
                    <input
                      type="text"
                      value={p.lastName}
                      onChange={(e) => handleParticipantChange(index, "lastName", e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </label>
                  <label className="modal-label">
                    Email
                    <input
                      type="email"
                      value={p.email}
                      onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                      placeholder="nom@exemple.com"
                      required
                    />
                  </label>
                </div>
              ))}

              <button type="button" className="modal-add" onClick={addParticipant}>
                + Ajouter un participant
              </button>

              <div className="modal-actions">
                <button type="submit" className="modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
