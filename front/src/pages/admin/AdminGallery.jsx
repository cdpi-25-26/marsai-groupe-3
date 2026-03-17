import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  notifyPublicGalleryStatusChanged,
} from "../../utils/usePhase3Closure.js";
import {
  deleteAdminVideo,
  getAdminVideos,
  getPublicGalleryStatus,
  setPhase2Selection,
  setPhase3Award,
  setPublicGalleryStatus,
  setVideoEligibility,
} from "../../api/videos";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "../public/Gallery.css";
import "./AdminGallery.css";

const PHASES = {
  phase1: {
    title: "Phase 1 · Validation admin",
    description: "Soumissions en attente et vidéos validées en attente du vote jury.",
    statuses: ["soumis", "retenue"],
  },
  phase2: {
    title: "Phase 2 · Sélection Top 50",
    description: "Vidéos ayant reçu au moins un vote jury, à sélectionner pour la phase 3.",
    statuses: ["à discuter"],
  },
  phase3: {
    title: "Phase 3 · Palmarès",
    description: "Vidéos du Top 50. Marquez les vidéos primées.",
    statuses: ["finaliste"],
  },
};

function AdminGallery() {
  const { tr } = useLanguage();
  const [cardSize, setCardSize] = useState("medium");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhase, setActivePhase] = useState("phase1");
  const [publicGalleryOpen, setPublicGalleryOpen] = useState(false);
  const [galleryToggleLoading, setGalleryToggleLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminVideos();
      setVideos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || tr("Impossible de charger les vidéos admin", "Unable to load admin videos"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapPage = async () => {
      await fetchVideos();

      try {
        const statusResponse = await getPublicGalleryStatus();
        const nextIsOpen = Boolean(statusResponse.data?.isOpen);
        setPublicGalleryOpen(nextIsOpen);
        notifyPublicGalleryStatusChanged(nextIsOpen);
      } catch {
        setPublicGalleryOpen(false);
        notifyPublicGalleryStatusChanged(false);
      }
    };

    bootstrapPage();
  }, []);

  const handleDecision = async (videoId, decision) => {
    try {
      await setVideoEligibility(videoId, decision);
      await fetchVideos();
    } catch (err) {
      alert(err.response?.data?.error || tr("Action impossible", "Action failed"));
    }
  };

  const handleDelete = async (video) => {
    const hasConfirmed = window.confirm(
      tr(`Supprimer définitivement la vidéo "${video.title}" ? Cette action est irréversible.`, `Permanently delete video "${video.title}"? This action cannot be undone.`),
    );

    if (!hasConfirmed) {
      return;
    }

    try {
      await deleteAdminVideo(video.id);
      await fetchVideos();
    } catch (err) {
      alert(err.response?.data?.error || tr("Suppression impossible", "Deletion failed"));
    }
  };

  const handlePhase3Award = async (video, nextValue) => {
    try {
      await setPhase3Award(video.id, nextValue);
      await fetchVideos();
    } catch (err) {
      alert(err.response?.data?.error || tr("Mise à jour phase 3 impossible", "Phase 3 update failed"));
    }
  };

  const handlePhase2Selection = async (video, isSelected) => {
    try {
      await setPhase2Selection(video.id, isSelected);
      await fetchVideos();
    } catch (err) {
      alert(err.response?.data?.error || tr("Mise à jour phase 2 impossible", "Phase 2 update failed"));
    }
  };

  const handleTogglePublicGallery = async () => {
    try {
      setGalleryToggleLoading(true);
      const nextValue = !publicGalleryOpen;
      const response = await setPublicGalleryStatus(nextValue);
      const nextIsOpen = Boolean(response.data?.isOpen);
      setPublicGalleryOpen(nextIsOpen);
      notifyPublicGalleryStatusChanged(nextIsOpen);
    } catch (err) {
      alert(err.response?.data?.error || tr("Mise à jour impossible", "Update failed"));
    } finally {
      setGalleryToggleLoading(false);
    }
  };

  if (loading) {
    return <div className="content py-12 text-white">{tr("Chargement des vidéos...", "Loading videos...")}</div>;
  }

  if (error) {
    return <div className="content py-12 text-red-400">{error}</div>;
  }

  const phase1Videos = videos.filter((video) => PHASES.phase1.statuses.includes(video.status));
  const phase2Videos = videos.filter((video) => PHASES.phase2.statuses.includes(video.status));
  const phase3Videos = videos.filter((video) => PHASES.phase3.statuses.includes(video.status));

  const finalistesCount = videos.filter((video) => video.status === "finaliste").length;
  const refusedCount = videos.filter((video) => video.status === "refusé").length;
  const refusedVideos = videos.filter((video) => video.status === "refusé");

  const counters = {
    phase1: phase1Videos.length,
    phase2: phase2Videos.length,
    phase3: phase3Videos.length,
  };

  const activeVideos = videos.filter((video) => PHASES[activePhase].statuses.includes(video.status));

  const getRefusalPhase = (video) => {
    const hasJuryVotes = (video.yesVotes || 0) + (video.noVotes || 0) > 0;

    if (hasJuryVotes) {
      return {
        code: "phase2",
        label: tr("Refusé en phase 2 · Vote jury", "Rejected in phase 2 · Jury vote"),
      };
    }

    return {
      code: "phase1",
      label: tr("Refusé en phase 1 · Validation admin", "Rejected in phase 1 · Admin validation"),
    };
  };

  return (
    <div className="container bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen pb-20">
      <div className="content max-w-7xl mx-auto px-4 py-12">
        <div className="header mb-8 admin-gallery-header-panel">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">GALLERY ADMIN</h1>
            <p className="text-gray-300">
              {tr("Pilotage des phases: validation admin, suivi jury et résultats.", "Phase workflow: admin validation, jury follow-up, and results.")}
            </p>

            <button
              type="button"
              className={`admin-public-gallery-toggle ${publicGalleryOpen ? "is-open" : "is-closed"}`}
              onClick={handleTogglePublicGallery}
              disabled={galleryToggleLoading}
            >
              {galleryToggleLoading
                ? tr("Mise à jour...", "Updating...")
                : publicGalleryOpen
                  ? tr("Galerie publique visible", "Public gallery visible")
                  : tr("Afficher le bouton Gallery publique", "Show public gallery button")}
            </button>
          </div>

          <div className="admin-gallery-kpis">
            <article className="admin-gallery-kpi-card">
              <p>TOTAL</p>
              <strong>{videos.length}</strong>
            </article>
            <article className="admin-gallery-kpi-card">
              <p>{tr("EN ATTENTE JURY", "WAITING JURY")}</p>
              <strong>{videos.filter((video) => video.status === "retenue").length}</strong>
            </article>
            <article className="admin-gallery-kpi-card">
              <p>{tr("FINALISTES", "FINALISTS")}</p>
              <strong>{finalistesCount}</strong>
            </article>
            <article className="admin-gallery-kpi-card">
              <p>{tr("REFUSÉS", "REJECTED")}</p>
              <strong>{refusedCount}</strong>
            </article>
          </div>
        </div>

        <div className="admin-gallery-phases" role="tablist" aria-label={tr("Phases admin gallery", "Admin gallery phases")}>
          {Object.entries(PHASES).map(([phaseKey, phaseConfig]) => (
            <button
              key={phaseKey}
              type="button"
              className={`admin-phase-tab ${activePhase === phaseKey ? "is-active" : ""}`}
              onClick={() => setActivePhase(phaseKey)}
            >
              <span>{phaseConfig.title}</span>
              <strong>{counters[phaseKey]}</strong>
            </button>
          ))}
        </div>

        <p className="admin-phase-description">{PHASES[activePhase].description}</p>

        <div className="gallery-view-controls">
          <label htmlFor="gallery-size-admin">{tr("Affichage", "View")}</label>
          <select
            id="gallery-size-admin"
            className="gallery-size-select"
            value={cardSize}
            onChange={(event) => setCardSize(event.target.value)}
          >
            <option value="small">{tr("Petite", "Small")}</option>
            <option value="medium">{tr("Moyenne", "Medium")}</option>
            <option value="large">{tr("Grande", "Large")}</option>
          </select>
        </div>

        {videos.length === 0 ? (
          <div className="text-white">{tr("Aucune vidéo pour le moment.", "No videos for now.")}</div>
        ) : activeVideos.length === 0 ? (
          <div className="text-white">{tr("Aucune vidéo dans cette phase actuellement.", "No videos in this phase right now.")}</div>
        ) : (
          <div className={`grid gallery-cards-grid gallery-size-${cardSize} mb-12`}>
            {activeVideos.map((video) => (
              <div key={video.id} className={`card group ${video.isAwarded ? "card-awarded" : ""}`}>
                <div className="image relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={video.thumbnail || "https://via.placeholder.com/300x200"}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="badge absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {video.status || "soumis"}
                  </div>
                  <div className="overlay absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                    <Link
                      to={`/films/${video.id}`}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors text-center"
                    >
                      {tr("VOIR PLUS", "SEE MORE")}
                    </Link>
                  </div>
                </div>

                <div className="info">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{video.synopsisOriginal || "Sans synopsis"}</p>

                  {video.assignedJuryId ? (
                    <p className="admin-assigned-jury">Jury assigné: #{video.assignedJuryId}</p>
                  ) : null}

                  {video.status === "soumis" ? (
                    <div className="admin-gallery-actions">
                      <button
                        type="button"
                        className="admin-eligible-btn"
                        onClick={() => handleDecision(video.id, "eligible")}
                      >
                        {tr("VALIDER POUR JURY", "APPROVE FOR JURY")}
                      </button>
                      <button
                        type="button"
                        className="admin-reject-btn"
                        onClick={() => handleDecision(video.id, "rejected")}
                      >
                        {tr("REFUSER", "REJECT")}
                      </button>
                    </div>
                  ) : video.status === "retenue" ? (
                    <p className="text-xs text-gray-400">
                      {tr("En attente du premier vote jury.", "Waiting for first jury vote.")}
                    </p>
                  ) : video.status === "à discuter" ? (
                    <div className="admin-phase3-actions">
                      <button
                        type="button"
                        className="admin-priority-btn"
                        onClick={() => handlePhase2Selection(video, true)}
                      >
                        {tr("AJOUTER AU TOP 50", "ADD TO TOP 50")}
                      </button>

                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() => handleDelete(video)}
                      >
                        {tr("SUPPRIMER", "DELETE")}
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">{tr("Statut verrouillé après décision initiale admin.", "Status locked after initial admin decision.")}</p>
                  )}

                  {video.status === "finaliste" ? (
                    <div className="admin-phase3-actions">
                      <button
                        type="button"
                        className="admin-priority-btn"
                        onClick={() => handlePhase2Selection(video, false)}
                      >
                        {tr("RETOUR PHASE 2", "BACK TO PHASE 2")}
                      </button>

                      <button
                        type="button"
                        className={`admin-priority-btn ${video.isAwarded ? "is-active" : ""}`}
                        onClick={() => handlePhase3Award(video, !video.isAwarded)}
                      >
                        {video.isAwarded ? tr("RETIRER PRIMÉ", "UNMARK AWARDED") : tr("MARQUER PRIMÉ", "MARK AWARDED")}
                      </button>
                    </div>
                  ) : (
                    video.status !== "à discuter" && (
                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() => handleDelete(video)}
                      >
                        {tr("SUPPRIMER", "DELETE")}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="admin-refused-section">
          <div className="admin-refused-header">
            <h2>{tr("Vidéos refusées", "Rejected videos")}</h2>
            <span>{refusedVideos.length}</span>
          </div>

          {refusedVideos.length === 0 ? (
            <p className="admin-refused-empty">
              {tr("Aucune vidéo refusée pour le moment.", "No rejected videos for now.")}
            </p>
          ) : (
            <div className="admin-refused-list">
              {refusedVideos.map((video) => {
                const refusalPhase = getRefusalPhase(video);

                return (
                  <article key={`refused-${video.id}`} className="admin-refused-item">
                    <div>
                      <h3>{video.title}</h3>
                      <p>{video.synopsisOriginal || tr("Sans synopsis", "No synopsis")}</p>
                      <Link to={`/films/${video.id}`} className="admin-refused-link">
                        {tr("VOIR PLUS", "SEE MORE")}
                      </Link>
                    </div>

                    <span className={`admin-refused-phase ${refusalPhase.code}`}>
                      {refusalPhase.label}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminGallery;
