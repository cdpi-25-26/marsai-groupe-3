import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getVideoDetail } from "../../api/videos";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./FilmDetail.css";

function FilmDetail() {
  const { tr } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getVideoDetail(id);
        setVideo(response.data);
      } catch (err) {
        setError(err.response?.data?.error || tr("Impossible de charger les détails du film", "Unable to load film details"));
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="film-detail-page">{tr("Chargement...", "Loading...")}</div>;
  }

  if (error || !video) {
    return (
      <div className="film-detail-page">
        <div className="film-detail-card">
          <h1>{tr("Accès impossible", "Access denied")}</h1>
          <p>{error || tr("Film introuvable", "Film not found")}</p>
          <button type="button" onClick={handleGoBack} className="film-detail-back">{tr("Retour", "Back")}</button>
        </div>
      </div>
    );
  }

  const mediaItems = [video.youtubeLink, ...(video.mediaGallery || [])].filter(Boolean);
  const classificationLabel =
    video.classification === "generation_integrale"
      ? tr("Génération intégrale (100% IA)", "Full generation (100% AI)")
      : video.classification === "production_hybride"
        ? tr("Production hybride", "Hybrid production")
        : video.classification || tr("Non renseigné", "Not provided");

  const teamMembers = Array.isArray(video.team) ? video.team : [];

  return (
    <div className="film-detail-page">
      <div className="film-detail-card">
        <div className="film-detail-header">
          <h1>{video.title}</h1>
          <span className="film-detail-status">{video.status}</span>
        </div>

        <p className="film-detail-subtitle">{video.titleEnglish || tr("Sans titre anglais", "No English title")}</p>

        <div className="film-detail-grid">
          <div className="film-detail-media">
            {video.youtubeLink ? (
              video.youtubeLink.includes("youtube.com") || video.youtubeLink.includes("youtu.be") ? (
                <iframe
                  className="film-player"
                  src={video.youtubeLink.replace("watch?v=", "embed/")}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video className="film-player" controls src={video.youtubeLink} />
              )
            ) : (
              <div className="film-no-media">{tr("Aucune vidéo disponible", "No video available")}</div>
            )}

            {mediaItems.length > 1 && (
              <div className="film-gallery-row">
                {mediaItems.slice(1).map((item, index) => (
                  <img key={`${item}-${index}`} src={item} alt={`media-${index + 1}`} />
                ))}
              </div>
            )}
          </div>

          <div className="film-detail-info">
            <div>
              <h3>Synopsis</h3>
              <p>{video.synopsisOriginal || tr("Non renseigné", "Not provided")}</p>
            </div>

            <div>
              <h3>{tr("Synopsis (anglais)", "Synopsis (English)")}</h3>
              <p>{video.synopsisEnglish || tr("Non renseigné", "Not provided")}</p>
            </div>

            <div>
              <h3>{tr("Déclaration IA", "AI declaration")}</h3>
              <ul>
                <li>{tr("Classification", "Classification")}: {classificationLabel}</li>
                <li>{tr("Stack technologique", "Tech stack")}: {video.techStack || tr("Non renseigné", "Not provided")}</li>
                <li>{tr("Méthodologie créative", "Creative methodology")}: {video.methodology || tr("Non renseigné", "Not provided")}</li>
              </ul>
            </div>

            <div>
              <h3>{tr("Détails du film", "Film details")}</h3>
              <ul>
                <li>{tr("Langue", "Language")}: {video.language || tr("Non renseigné", "Not provided")}</li>
                <li>{tr("Durée", "Duration")}: {video.duration ? `${video.duration}s` : tr("Non renseigné", "Not provided")}</li>
                <li>{tr("Sous-titres requis", "Subtitles required")}: {video.hasSubtitles ? tr("Oui", "Yes") : tr("Non", "No")}</li>
                <li>{tr("Réalisateur", "Director")}: {video.creator || tr("Non renseigné", "Not provided")}</li>
                <li>{tr("Origine", "Country")}: {video.country || tr("Non renseigné", "Not provided")}</li>
                <li>{tr("Votes jury", "Jury votes")}: {tr("OUI", "YES")} {video.yesVotes || 0} / {tr("NON", "NO")} {video.noVotes || 0}</li>
              </ul>
            </div>

            <div>
              <h3>{tr("Équipe soumise", "Submitted team")}</h3>
              {teamMembers.length === 0 ? (
                <p>{tr("Non renseigné", "Not provided")}</p>
              ) : (
                <ul>
                  {teamMembers.map((member, index) => (
                    <li key={`${member.email || "member"}-${index}`}>
                      {(member.civility || "").trim()} {(member.firstName || "").trim()} {(member.lastName || "").trim()} — {member.profession || tr("Profession non renseignée", "Profession not provided")}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {Array.isArray(video.comments) && video.comments.length > 0 && (
              <div>
                <h3>{tr("Commentaires du jury", "Jury comments")}</h3>
                <ul>
                  {video.comments.map((item, index) => (
                    <li key={`${item.userId}-${index}`}>
                      {item.vote}: {item.comment}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <button type="button" onClick={handleGoBack} className="film-detail-back">{tr("Retour", "Back")}</button>
      </div>
    </div>
  );
}

export default FilmDetail;
