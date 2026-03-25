import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getAwardedGalleryStatus, getAwardedVideos } from "../../api/videos";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Gallery.css";

function AwardedGallery() {
  const { tr } = useLanguage();
  const [cardSize, setCardSize] = useState("medium");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryStatus, setGalleryStatus] = useState({ isOpen: false, totalAwardedVideos: 0 });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const statusResponse = await getAwardedGalleryStatus();
        const statusData = statusResponse.data || {};
        setGalleryStatus(statusData);

        if (!statusData.isOpen) {
          setVideos([]);
          return;
        }

        const response = await getAwardedVideos();
        setVideos(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des primés:", err);
        setError(tr("Impossible de charger les vidéos primées", "Unable to load awarded videos"));
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="container gallery-state-wrapper">
        <p className="gallery-state-text">{tr("Chargement...", "Loading...")}</p>
      </div>
    );
  }

  if (!galleryStatus.isOpen) {
    return (
      <div className="container gallery-state-wrapper">
        <p className="gallery-state-text">
          {tr(
            "La galerie des primés n'est pas encore disponible.",
            "The awarded gallery is not yet available.",
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="container bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen pb-20">
      <div className="content max-w-7xl mx-auto px-4 py-12">
        <div className="header mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-white">{tr("GALERIE DES", "GALLERY OF")} <br /> {tr("FILMS", "")}</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              {tr("PRIMÉS", "AWARDED FILMS")}
            </span>
          </h1>
        </div>

        <div className="gallery-view-controls">
          <label htmlFor="gallery-size-awarded">{tr("Affichage", "View")}</label>
          <select
            id="gallery-size-awarded"
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
          <div className="gallery-state-error">{error}</div>
        ) : videos.length === 0 ? (
          <div className="gallery-state-empty">
            <p>{tr("Aucun film primé pour le moment.", "No awarded films yet.")}</p>
          </div>
        ) : (
          <>
            <div className={`grid gallery-cards-grid gallery-size-${cardSize} mb-12`}>
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="card group card-clickable card-awarded"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="image relative overflow-hidden rounded-2xl mb-3">
                    <img
                      src={video.thumbnail || "https://via.placeholder.com/300x200"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="badge absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      🏆 {tr("PRIMÉ", "AWARDED")}
                    </div>
                    <div className="rating absolute bottom-3 right-3 flex items-center gap-1 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-lg">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white text-sm font-bold">#{index + 1}</span>
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
                    <span className="video-modal-status" style={{ background: "linear-gradient(90deg,#ca8a04,#f59e0b)" }}>
                      🏆 {tr("PRIMÉ", "AWARDED")}
                    </span>
                    <h3 className="video-modal-title">{selectedVideo.title}</h3>
                    <p className="video-modal-synopsis">
                      {selectedVideo.synopsisOriginal || tr("Sans synopsis", "No synopsis")}
                    </p>
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

export default AwardedGallery;
