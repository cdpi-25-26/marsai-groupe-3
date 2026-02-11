import { Videos } from "../models/index.js";

// Liste
function getVideos(req, res) {
  Videos.findAll().then((videos) => {
    res.json(videos);
  });
}

// Création
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

// Soumission complète d'une vidéo
function submitVideo(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const {
    title,
    titleEnglish,
    duration,
    language,
    synopsisOriginal,
    synopsisEnglish,
    classification,
    techStack,
    methodology,
    youtubeLink,
    hasSubtitles,
    thumbnail,
    mediaGallery,
    team
  } = req.body;

  // Validation des champs obligatoires
  if (!title || !duration || !language || !synopsisOriginal || 
      !classification || !youtubeLink || !team) {
    return res.status(400).json({ 
      error: "Tous les champs obligatoires doivent être remplis" 
    });
  }

  // Validation de l'équipe
  if (!Array.isArray(team) || team.length === 0) {
    return res.status(400).json({ 
      error: "Au moins un membre d'équipe est requis" 
    });
  }

  Video.create({
    title,
    titleEnglish,
    duration,
    language,
    synopsisOriginal,
    synopsisEnglish,
    classification,
    techStack,
    methodology,
    youtubeLink,
    hasSubtitles: hasSubtitles || false,
    thumbnail,
    mediaGallery,
    team,
    status: 'submitted'
  })
  .then((newVideo) => {
    res.status(201).json(newVideo);
  })
  .catch((error) => {
    console.error("Erreur lors de la création de la vidéo:", error);
    res.status(500).json({ error: "Erreur lors de la soumission" });
  });
}

export default { getVideos, createVideo, submitVideo };