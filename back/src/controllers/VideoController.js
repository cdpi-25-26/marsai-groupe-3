import { Videos } from "../models/index.js";


function getVideos(req, res) {
  Videos.findAll().then((videos) => {
    res.json(videos);
  });
}


function createVideo(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Videos.findOne({ where: { title } }).then((video) => {
    if (video) {
      res.json(video);
    } else {
      Videos.create({ title: title, description: description }).then(
        (newVideo) => {
          res.status(201).json(newVideo);
        },
      );
    }
  });
}

const assignVideoToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user } = req.body;

    if (!id_user) {
      return res.status(400).json({ error: "id_user requis" });
    }

    const video = await Videos.findByPk(id);
    if (!video) {
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }

    video.id_user = id_user;
    await video.save();

    res.json({ message: "Vidéo attribuée avec succès" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export default {
  getVideos,
  createVideo,
  assignVideoToUser
};
