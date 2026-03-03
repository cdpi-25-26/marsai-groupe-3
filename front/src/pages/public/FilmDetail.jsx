import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getVideoDetail } from "../../api/videos";
import "./FilmDetail.css";

function FilmDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getVideoDetail(id);
        setVideo(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Impossible de charger les détails du film");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="film-detail-page">Chargement...</div>;
  }

  if (error || !video) {
    return (
      <div className="film-detail-page">
        <div className="film-detail-card">
          <h1>Accès impossible</h1>
          <p>{error || "Film introuvable"}</p>
          <Link to="/gallery" className="film-detail-back">Retour galerie</Link>
        </div>
      </div>
    );
  }

  const mediaItems = [video.youtubeLink, ...(video.mediaGallery || [])].filter(Boolean);
  const classificationLabel =
    video.classification === "generation_integrale"
      ? "Génération intégrale (100% IA)"
      : video.classification === "production_hybride"
        ? "Production hybride"
        : video.classification || "Non renseigné";

  const teamMembers = Array.isArray(video.team) ? video.team : [];

  return (
    <div className="film-detail-page">
      <div className="film-detail-card">
        <div className="film-detail-header">
          <h1>{video.title}</h1>
          <span className="film-detail-status">{video.status}</span>
        </div>

        <p className="film-detail-subtitle">{video.titleEnglish || "Sans titre anglais"}</p>

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
              <div className="film-no-media">Aucune vidéo disponible</div>
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
              <p>{video.synopsisOriginal || "Non renseigné"}</p>
            </div>

            <div>
              <h3>Synopsis (anglais)</h3>
              <p>{video.synopsisEnglish || "Non renseigné"}</p>
            </div>

            <div>
              <h3>Déclaration IA</h3>
              <ul>
                <li>Classification: {classificationLabel}</li>
                <li>Stack technologique: {video.techStack || "Non renseigné"}</li>
                <li>Méthodologie créative: {video.methodology || "Non renseigné"}</li>
              </ul>
            </div>

            <div>
              <h3>Détails du film</h3>
              <ul>
                <li>Langue: {video.language || "Non renseigné"}</li>
                <li>Durée: {video.duration ? `${video.duration}s` : "Non renseigné"}</li>
                <li>Sous-titres requis: {video.hasSubtitles ? "Oui" : "Non"}</li>
                <li>Réalisateur: {video.creator || "Non renseigné"}</li>
                <li>Origine: {video.country || "Non renseigné"}</li>
                <li>Votes jury: OUI {video.yesVotes || 0} / NON {video.noVotes || 0}</li>
              </ul>
            </div>

            <div>
              <h3>Équipe soumise</h3>
              {teamMembers.length === 0 ? (
                <p>Non renseigné</p>
              ) : (
                <ul>
                  {teamMembers.map((member, index) => (
                    <li key={`${member.email || "member"}-${index}`}>
                      {(member.civility || "").trim()} {(member.firstName || "").trim()} {(member.lastName || "").trim()} — {member.profession || "Profession non renseignée"}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {Array.isArray(video.comments) && video.comments.length > 0 && (
              <div>
                <h3>Commentaires du jury</h3>
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

        <Link to="/gallery" className="film-detail-back">Retour galerie</Link>
      </div>
    </div>
  );
}

export default FilmDetail;
