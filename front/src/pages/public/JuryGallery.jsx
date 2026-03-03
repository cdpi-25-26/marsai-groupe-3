import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getJuryVideos, submitJuryVote } from "../../api/videos";
import "./Gallery.css";
import "./JuryGallery.css";

function JuryGallery() {
  const currentRole = localStorage.getItem("role");
  const canVote = currentRole === "JURY";

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
      setError(err.response?.data?.error || "Impossible de charger la gallery jury");
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
      alert(err.response?.data?.error || "Vote impossible");
    }
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Chargement des vidéos jury...</p>
      </div>
    );
  }

  return (
    <div className="container bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen pb-20">
      <div className="content max-w-7xl mx-auto px-4 py-12">
        <div className="header mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-white">GALLERY </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              JURY
            </span>
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Les vidéos éligibles validées par l&apos;admin passent ici. Votez OUI ou NON. Les films deviennent publics seulement en majorité OUI.
          </p>

          {!canVote && (
            <p className="jury-readonly-note">
              Mode lecture seule: seuls les comptes JURY peuvent voter.
            </p>
          )}
        </div>

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : videos.length === 0 ? (
          <div className="text-white text-center py-12">
            <p className="text-xl">Aucune vidéo à voter actuellement</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {videos.map((video) => (
              <div key={video.id} className="card group">
                <div className="image relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={video.thumbnail || "https://via.placeholder.com/300x200"}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="badge absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {video.status || "retenue"}
                  </div>
                  <div className="overlay absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                    <Link
                      to={`/films/${video.id}`}
                      className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors text-center"
                    >
                      VOIR PLUS
                    </Link>
                  </div>
                </div>

                <div className="info">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{video.synopsisOriginal || "Sans synopsis"}</p>

                  <p className="jury-vote-counts">
                    OUI: {video.yesVotes || 0} · NON: {video.noVotes || 0}
                  </p>

                  {canVote ? (
                    <>
                      <textarea
                        className="jury-comment-input"
                        value={voteComments[video.id] || ""}
                        onChange={(event) =>
                          setVoteComments((prev) => ({
                            ...prev,
                            [video.id]: event.target.value,
                          }))
                        }
                        placeholder="Ajouter un commentaire (optionnel)"
                        maxLength={500}
                      />

                      <div className="jury-vote-actions">
                        <button
                          type="button"
                          className="jury-yes-btn"
                          onClick={() => handleVote(video.id, "OUI")}
                        >
                          Accepter 👍
                        </button>
                        <button
                          type="button"
                          className="jury-no-btn"
                          onClick={() => handleVote(video.id, "NON")}
                        >
                          Refuser 👎
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="jury-readonly-note-card">Seul le rôle JURY peut voter.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JuryGallery;
