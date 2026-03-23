import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getJuryVideos, submitJuryVote } from "../../api/videos";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useAuthSession } from "../../utils/authSession.js";
import "./Gallery.css";
import "./JuryGallery.css";

function JuryGallery() {
  const { tr } = useLanguage();
  const { role: currentRole } = useAuthSession();
  const canVote = currentRole === "JURY";
  const [cardSize, setCardSize] = useState("medium");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [videos, setVideos] = useState([]);
  const [voteComments, setVoteComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getJuryVideos();
      setVideos(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || tr("Impossible de charger la gallery jury", "Unable to load jury gallery"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVote = async (videoId, vote) => {
    if (!canVote) {
      return;
    }

    try {
      await submitJuryVote(videoId, vote, voteComments[videoId] || "");
      setVoteComments((prev) => ({ ...prev, [videoId]: "" }));
      await fetchVideos();
    } catch (err) {
      const responseData = err.response?.data;
      const apiError = responseData?.error;
      const apiDetails = responseData?.details;
      const detailedMessage =
        (apiError && apiDetails && `${apiError} (${apiDetails})`) ||
        apiError ||
        apiDetails ||
        (typeof responseData === "string" ? responseData : null) ||
        err.message ||
        tr("Vote impossible", "Vote failed");
      alert(detailedMessage);
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">{tr("Chargement des vidéos jury...", "Loading jury videos...")}</p>
      </div>
    );
  }

  return (
    <div className="container bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen pb-20">
      <div className="content max-w-7xl mx-auto px-4 py-12">
        <div className="header mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-white">{tr("GALLERY", "GALLERY")} </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {tr("JURY", "JURY")}
            </span>
          </h1>
          <p className="text-gray-300 max-w-3xl">
            {tr("Les vidéos validées par l'admin arrivent ici en phase 1. Dès votre vote, la vidéo passe en phase 2 pour la sélection Top 50 par l'admin.", "Admin-approved videos arrive here in phase 1. As soon as you vote, the video moves to phase 2 for the admin Top 50 selection.")}
          </p>

          {!canVote && (
            <p className="jury-readonly-note">
              {tr("Mode lecture seule: seuls les comptes JURY peuvent voter.", "Read-only mode: only JURY accounts can vote.")}
            </p>
          )}
        </div>

        <div className="gallery-view-controls">
          <label htmlFor="gallery-size-jury">{tr("Affichage", "View")}</label>
          <select
            id="gallery-size-jury"
            className="gallery-size-select"
            value={cardSize}
            onChange={(event) => setCardSize(event.target.value)}
          >
            <option value="small">{tr("Petite", "Small")}</option>
            <option value="medium">{tr("Moyenne", "Medium")}</option>
            <option value="large">{tr("Grande", "Large")}</option>
          </select>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-white text-center py-12">
            <p className="text-xl">{tr("Aucune vidéo à voter actuellement", "No videos to vote right now")}</p>
          </div>
        ) : (
          <>
          <div className={`grid gallery-cards-grid gallery-size-${cardSize} mb-12`}>
            {videos.map((video) => (
              <div
                key={video.id}
                className="card group card-clickable"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="image relative overflow-hidden rounded-2xl mb-3">
                  <img
                    src={video.thumbnail || "https://via.placeholder.com/300x200"}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="badge absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {video.status || "retenue"}
                  </div>
                </div>
                <div className="info">
                  <h3 className="text-white font-bold text-sm line-clamp-2">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {selectedVideo && (
            <div className="video-modal-backdrop" onClick={() => setSelectedVideo(null)}>
              <div className="video-modal" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="video-modal-close"
                  onClick={() => setSelectedVideo(null)}
                >
                  ✕
                </button>
                <img
                  src={selectedVideo.thumbnail || "https://via.placeholder.com/480x270"}
                  alt={selectedVideo.title}
                  className="video-modal-img"
                />
                <div className="video-modal-body">
                  <span className="video-modal-status">{selectedVideo.status || "retenue"}</span>
                  <h3 className="video-modal-title">{selectedVideo.title}</h3>
                  <p className="video-modal-synopsis">
                    {selectedVideo.synopsisOriginal || tr("Sans synopsis", "No synopsis")}
                  </p>

                  <p className="jury-vote-counts">
                    {tr("OUI", "YES")}: {selectedVideo.yesVotes || 0} · {tr("NON", "NO")}: {selectedVideo.noVotes || 0}
                  </p>

                  {canVote ? (
                    <>
                      <textarea
                        className="jury-comment-input"
                        value={voteComments[selectedVideo.id] || ""}
                        onChange={(event) =>
                          setVoteComments((prev) => ({
                            ...prev,
                            [selectedVideo.id]: event.target.value,
                          }))
                        }
                        placeholder={tr("Ajouter un commentaire (optionnel)", "Add a comment (optional)")}
                        maxLength={255}
                      />
                      <div className="jury-vote-actions">
                        <button
                          type="button"
                          className="jury-yes-btn"
                          onClick={() => { handleVote(selectedVideo.id, "OUI"); setSelectedVideo(null); }}
                        >
                          {tr("Accepter", "Accept")} 👍
                        </button>
                        <button
                          type="button"
                          className="jury-no-btn"
                          onClick={() => { handleVote(selectedVideo.id, "NON"); setSelectedVideo(null); }}
                        >
                          {tr("Refuser", "Reject")} 👎
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="jury-readonly-note-card">{tr("Seul le rôle JURY peut voter.", "Only JURY role can vote.")}</p>
                  )}

                  <Link to={`/films/${selectedVideo.id}`} className="video-modal-see-more">
                    {tr("VOIR PLUS", "SEE MORE")}
                  </Link>
                </div>
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}

export default JuryGallery;
