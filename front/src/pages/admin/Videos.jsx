import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getAdminVideos } from "../../api/videos.js";

function Videos() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["adminVideos"],
    queryFn: getAdminVideos,
  });

  if (isPending) {
    return <div>Chargement en cours...</div>;
  }

  if (isError) {
    return <div>Une erreur est survenue : {error.message}</div>;
  }

  const videos = data?.data || [];

  if (videos.length === 0) {
    return <div>Aucune vidéo trouvée.</div>;
  }

  return (
    <div className="admin-videos-list">
      <p className="admin-videos-count">{videos.length} film(s) dans la base</p>

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
              <p>{video.synopsisOriginal || "Synopsis non renseigné."}</p>

              <div className="admin-video-meta">
                <span>{video.classification || "Non classé"}</span>
                <span>{video.language || "Langue N/A"}</span>
                <span>{video.duration ? `${video.duration}s` : "Durée N/A"}</span>
              </div>

              <div className="admin-video-actions">
                <Link to={`/films/${video.id}`}>Voir le détail</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Videos;
