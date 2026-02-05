import { useState, useEffect } from "react";
import { getVideos } from "../../api/videos";
import "./Gallery.css";

function Gallery() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    type: "",
    country: "",
    status: "",
  });

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await getVideos();
        const videoList = response.data || [];
        setVideos(videoList);
        setFilteredVideos(videoList);
      } catch (err) {
        console.error("Erreur lors de la récupération des vidéos:", err);
        setError("Impossible de charger les vidéos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    if (filters.type) {
      filtered = filtered.filter(
        (video) =>
          video.classification &&
          video.classification.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.country) {
      filtered = filtered.filter(
        (video) =>
          video.country &&
          video.country.toLowerCase() === filters.country.toLowerCase()
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (video) =>
          video.status &&
          video.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [filters, videos]);

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const typeOptions = [
    ...new Set(videos.map((v) => v.classification).filter(Boolean)),
  ];
  const countryOptions = [
    ...new Set(videos.map((v) => v.country).filter(Boolean)),
  ];
  const statusOptions = [
    ...new Set(videos.map((v) => v.status).filter(Boolean)),
  ];

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Chargement des vidéos...</p>
      </div>
    );
  }

  return (
    <div className="container bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen pb-20">
      <div className="content max-w-7xl mx-auto px-4 py-12">
        <div className="header mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-white">LA GALERIE <br/> DES </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600">
               FILMS
            </span>
          </h1>
        </div>

        <div className="filters mb-12 flex flex-col md:flex-row gap-4">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="select-p2 rounded-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 cursor-pointer font-semibold"
          >
            <option value="">Type d'IA</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="select-p2 rounded-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 cursor-pointer font-semibold"
          >
            <option value="">Pays d'origine</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="select-p2 rounded-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 cursor-pointer font-semibold"
          >
            <option value="">Statut</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-white text-center py-12">
            <p className="text-xl">Aucune vidéo trouvée avec ces filtres</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedVideos.map((video) => (
                <div key={video.id} className="card group">
                  <div className="image relative overflow-hidden rounded-2xl mb-4">
                    <img
                      src={video.thumbnail || "https://via.placeholder.com/300x200"}
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="badge absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ART NUMÉRIQUE
                    </div>
                    <div className="rating absolute bottom-3 right-3 flex items-center gap-1 bg-gray-900 bg-opacity-70 px-2 py-1 rounded-lg">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-white text-sm font-bold">
                        #{startIndex + paginatedVideos.indexOf(video) + 1}
                      </span>
                    </div>
                    <div className="overlay absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                      <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors">
                        VOIR PLUS
                      </button>
                    </div>
                  </div>

                  <div className="info">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="text-sm text-gray-400 mb-3">
                      <p className="mb-1">
                        <span className="text-gray-500">Réalisateur: </span>
                        {video.creator || "Non spécifié"}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-blue-400">🌍</span>
                        <span>{video.country || "Non spécifié"}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="badge text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">
                        {video.classification || "Non classé"}
                      </span>
                      <span className="badge text-xs bg-pink-900 text-pink-300 px-2 py-1 rounded">
                        {video.status || "En attente"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn prev bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ❮
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn w-10 h-10 rounded-full font-bold transition-colors ${
                        currentPage === page
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn next bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ❯
                </button>

                <span className="text-gray-400 ml-2">
                  PAGE {currentPage} SUR {totalPages} - {filteredVideos.length}{" "}
                  FILMS TROUVÉS
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Gallery;
