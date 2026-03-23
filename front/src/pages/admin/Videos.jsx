import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getAdminVideos } from "../../api/videos.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

function Videos() {
  const { tr } = useLanguage();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["adminVideos"],
    queryFn: getAdminVideos,
  });

  if (isPending) {
    return <div>{tr("Chargement en cours...", "Loading...")}</div>;
  }

  if (isError) {
    return <div>{tr("Une erreur est survenue", "An error occurred")}: {error.message}</div>;
  }

  const videos = (data?.data || []).filter((video) => video.status !== "refusé");

  if (videos.length === 0) {
    return <div>{tr("Aucune vidéo trouvée.", "No videos found.")}</div>;
  }

  return (
    <div className="admin-videos-list">
      <p className="admin-videos-count">{videos.length} {tr("film(s) dans la base", "film(s) in database")}</p>

      <div className="admin-videos-grid">
        {videos.map((video) => (
          <article key={video.id} className="admin-video-card">
            <div className="admin-video-cover-wrap">
              <img
                src={video.thumbnail || "https://via.placeholder.com/640x360"}
                alt={video.title}
                className="admin-video-cover"
              />
              <span className="admin-video-status">{video.status || "soumis"}</span>
            </div>

            <div className="admin-video-body">
              <h4>{video.title}</h4>
              <p>{video.synopsisOriginal || tr("Synopsis non renseigné.", "Synopsis not provided.")}</p>

              <div className="admin-video-meta">
                <span>{video.classification || tr("Non classé", "Unclassified")}</span>
                <span>{video.language || tr("Langue N/A", "Language N/A")}</span>
                <span>{video.duration ? `${video.duration}s` : tr("Durée N/A", "Duration N/A")}</span>
              </div>

              <div className="admin-video-actions">
                <Link to={`/films/${video.id}`}>{tr("Voir le détail", "View details")}</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Videos;
