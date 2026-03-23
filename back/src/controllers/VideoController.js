import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Evaluations, SystemSettings, Users, Videos } from "../models/index.js";
import mailer from "../config/mailer.js";
import { videoSubmissionConfirmationTemplate } from "../templates/videoSubmissionConfirmation.js";
import { videoPhase1AcceptTemplate } from "../templates/videoPhase1Accept.js";
import { videoPhase1RejectTemplate } from "../templates/videoPhase1Reject.js";
import { videoTop50Template } from "../templates/videoTop50.js";
import { videoAwardedTemplate } from "../templates/videoAwarded.js";
import { isS3Configured, uploadBufferToS3 } from "../utils/s3.js";
import { resolveYouTubeVideo } from "../utils/youtube.js";

function truncateValue(value, maxLength = 255) {
  if (typeof value !== "string") {
    return value ?? null;
  }

  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

async function getVoteSummary(videoId) {
  const votes = await Evaluations.findAll({
    where: { id_video: videoId },
    attributes: ["id_user", "note", "commentary"],
  });

  const yesVotes = votes.filter((vote) => vote.note === "OUI").length;
  const noVotes = votes.filter((vote) => vote.note === "NON").length;

  return {
    yesVotes,
    noVotes,
    totalVotes: votes.length,
    isMajorityYes: yesVotes > noVotes,
    comments: votes
      .filter((vote) => typeof vote.commentary === "string" && vote.commentary.trim())
      .map((vote) => ({
        userId: vote.id_user,
        vote: vote.note,
        comment: vote.commentary,
      })),
  };
}

function parseTeamData(teamData) {
  if (!teamData) {
    return [];
  }

  try {
    const parsed = JSON.parse(teamData);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getPublicGalleryStatusPayload() {
  const [gallerySetting] = await SystemSettings.findOrCreate({
    where: { key: "public_gallery_open" },
    defaults: { isEnabled: false },
  });

  const totalPublicVideos = await Videos.count({
    where: { statusSelection: "finaliste" },
  });

  return {
    totalPublicVideos,
    isOpen: gallerySetting.isEnabled,
    controlledByAdmin: true,
  };
}

async function normalizeVideo(video) {
  const voteSummary = await getVoteSummary(video.id_video ?? video.id);
  const team = parseTeamData(video.teamData);

  const [legacyTechStack = "", legacyMethodology = ""] = String(video.toolsAI || "").split("\n\n");

  return {
    id: video.id_video ?? video.id,
    title: video.title,
    titleEnglish: video.traduction,
    duration: video.duration,
    language: video.FirstLanguage,
    synopsisOriginal: video.synopsis,
    synopsisEnglish: video.synopsisEnglish,
    classification: video.category,
    techStack: video.toolsAI || legacyTechStack,
    methodology: video.methodology || legacyMethodology,
    hasSubtitles: video.subTitles === "yes",
    youtubeLink: video.YoutubeLink,
    thumbnail: video.image1,
    mediaGallery: [video.image1, video.image2, video.image3].filter(Boolean),
    status: video.statusSelection,
    isAwarded: Boolean(video.isPriority),
    isPriority: Boolean(video.isPriority),
    assignedJuryId: video.id_assigned_jury || null,
    team,
    creator: null,
    country: null,
    ...voteSummary,
  };
}

async function sendMailToVideoOwner(idUser, subject, templateFn, videoTitle) {
  try {
    const owner = await Users.findOne({ where: { id: idUser } });
    if (!owner?.email) return;
    const displayName = [owner.name, owner.surname].filter(Boolean).join(" ").trim() || owner.email;
    await mailer.sendMail(owner.email, subject, templateFn(displayName, videoTitle));
  } catch (mailError) {
    console.error("Email de statut non envoye:", mailError?.message || mailError);
  }
}

async function getRequester(req) {
  const authHeader = req.header("Authorization");
  const [prefix, token] = authHeader?.split(" ") || [null, undefined];

  if (prefix !== "Bearer" || !token) {
    return { role: null, user: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ where: { email: decoded.username } });
    return { role: user?.role || null, user };
  } catch {
    return { role: null, user: null };
  }
}

async function mapVideos(videos) {
  return Promise.all(videos.map((video) => normalizeVideo(video)));
}

function saveFileLocally(req, file) {
  const uploadDirectory = path.resolve(process.cwd(), "uploads", "videos");
  fs.mkdirSync(uploadDirectory, { recursive: true });

  const safeOriginalName = file.originalname?.replace(/[^a-zA-Z0-9._-]/g, "-") || "video.bin";
  const filename = `${Date.now()}-${safeOriginalName}`;
  const filePath = path.join(uploadDirectory, filename);

  fs.writeFileSync(filePath, file.buffer);
  return `${req.protocol}://${req.get("host")}/uploads/videos/${filename}`;
}

// Liste
function getVideos(req, res) {
  return getPublicVideos(req, res);
}

async function getAdminVideos(req, res) {
  const videos = await Videos.findAll({ order: [["createdAt", "DESC"]] });
  res.json(await mapVideos(videos));
}

async function getJuryVideos(req, res) {
  const videos = await Videos.findAll({
    where: {
      statusSelection: "retenue",
    },
    order: [["createdAt", "DESC"]],
  });

  res.json(await mapVideos(videos));
}

async function getPublicVideos(req, res) {
  const galleryStatus = await getPublicGalleryStatusPayload();

  if (!galleryStatus.isOpen) {
    return res.json([]);
  }

  const videos = await Videos.findAll({
    where: { statusSelection: ["finaliste"] },
    order: [["createdAt", "DESC"]],
  });

  res.json(await mapVideos(videos));
}

async function setPhase3Award(req, res) {
  const { id } = req.params;
  const isAwarded =
    typeof req.body?.isAwarded === "boolean"
      ? req.body.isAwarded
      : req.body?.isPriority;

  if (typeof isAwarded !== "boolean") {
    return res.status(400).json({ error: "Le champ isAwarded doit être un booléen" });
  }

  const video = await Videos.findOne({ where: { id_video: id } });

  if (!video) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  if (video.statusSelection !== "finaliste") {
    return res.status(409).json({
      error: "Seules les vidéos finalistes peuvent être marquées comme primées",
    });
  }

  video.isPriority = isAwarded;
  await video.save();

  if (isAwarded) {
    sendMailToVideoOwner(
      video.id_user,
      `[MARS.AI] 🌟 Votre film "${video.title}" est primé !`,
      videoAwardedTemplate,
      video.title,
    );
  }

  return res.json(await normalizeVideo(video));
}

async function setPhase2Selection(req, res) {
  const { id } = req.params;
  const { isSelected } = req.body;

  if (typeof isSelected !== "boolean") {
    return res.status(400).json({ error: "Le champ isSelected doit etre un booleen" });
  }

  const video = await Videos.findOne({ where: { id_video: id } });

  if (!video) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  if (isSelected) {
    if (video.statusSelection !== "à discuter") {
      return res.status(409).json({
        error: "Seules les videos de phase 2 peuvent passer en phase 3",
      });
    }

    const currentTop50Count = await Videos.count({ where: { statusSelection: "finaliste" } });
    if (currentTop50Count >= 50) {
      return res.status(409).json({
        error: "Le Top 50 est deja complet",
      });
    }

    video.statusSelection = "finaliste";
    await video.save();
    sendMailToVideoOwner(
      video.id_user,
      `[MARS.AI] 🏆 Votre film "${video.title}" est dans le Top 50 !`,
      videoTop50Template,
      video.title,
    );
    return res.json(await normalizeVideo(video));
  }

  if (video.statusSelection !== "finaliste") {
    return res.status(409).json({
      error: "Seules les videos de phase 3 peuvent revenir en phase 2",
    });
  }

  video.statusSelection = "à discuter";
  video.isPriority = false;
  await video.save();

  return res.json(await normalizeVideo(video));
}

async function getPublicGalleryStatus(req, res) {
  return res.json(await getPublicGalleryStatusPayload());
}

async function setPublicGalleryStatus(req, res) {
  const { isOpen } = req.body;

  if (typeof isOpen !== "boolean") {
    return res.status(400).json({ error: "Le champ isOpen doit être un booléen" });
  }

  const [gallerySetting] = await SystemSettings.findOrCreate({
    where: { key: "public_gallery_open" },
    defaults: { isEnabled: false },
  });

  gallerySetting.isEnabled = isOpen;
  await gallerySetting.save();

  return res.json(await getPublicGalleryStatusPayload());
}

// Création
function createVideo(req, res) {
  if (!req.body) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const { title, description, category, thumbnail } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  Videos.findOne({ where: { title } }).then((video) => {
    if (video) {
      res.json(video);
    } else {
      Videos.create({
        title,
        synopsis: description,
        category: category || "production_hybride",
        image1: thumbnail || null,
        id_user: req.user?.id || 1,
      }).then(
        (newVideo) => {
          res.status(201).json(normalizeVideo(newVideo));
        },
      );
    }
  });
}

function uploadVideo(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier vidéo reçu" });
  }

  const maxFileSizeBytes = 500 * 1024 * 1024;
  if (req.file.size > maxFileSizeBytes) {
    return res.status(400).json({ error: "Le fichier dépasse la limite de 500MB" });
  }

  if (isS3Configured()) {
    return uploadBufferToS3({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      originalFilename: req.file.originalname,
    })
      .then(({ fileUrl, objectKey }) => {
        res.status(201).json({ fileUrl, storage: "s3", objectKey });
      })
      .catch((error) => {
        console.error("Erreur upload S3:", error?.message || error);
        res.status(500).json({ error: "Échec de l'upload vers S3" });
      });
  }

  const fileUrl = saveFileLocally(req, req.file);
  return res.status(201).json({ fileUrl, storage: "local" });
}

async function resolveYoutube(req, res) {
  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Le champ url est requis" });
  }

  try {
    const metadata = await resolveYouTubeVideo(url);
    return res.status(200).json(metadata);
  } catch (error) {
    const statusCode = error?.statusCode || 400;
    return res.status(statusCode).json({ error: error.message || "Lien YouTube invalide" });
  }
}

async function setAdminEligibility(req, res) {
  const { id } = req.params;
  const { decision } = req.body;

  if (!["eligible", "rejected"].includes(decision)) {
    return res.status(400).json({ error: "Décision invalide" });
  }

  const video = await Videos.findOne({ where: { id_video: id } });

  if (!video) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  if (video.statusSelection !== "soumis") {
    return res.status(409).json({
      error: "Décision admin impossible: cette vidéo est déjà traitée",
    });
  }

  if (decision === "eligible") {
    video.statusSelection = "retenue";
    video.id_assigned_jury = null;
    await video.save();
    sendMailToVideoOwner(
      video.id_user,
      `[MARS.AI] Votre film "${video.title}" est retenu en Phase 2`,
      videoPhase1AcceptTemplate,
      video.title,
    );
  } else {
    video.statusSelection = "refusé";
    video.id_assigned_jury = null;
    await video.save();
    sendMailToVideoOwner(
      video.id_user,
      `[MARS.AI] Résultat de votre soumission – "${video.title}"`,
      videoPhase1RejectTemplate,
      video.title,
    );
  }

  return res.json(await normalizeVideo(video));
}

async function deleteAdminVideo(req, res) {
  const { id } = req.params;

  const video = await Videos.findOne({ where: { id_video: id } });

  if (!video) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  await Evaluations.destroy({ where: { id_video: video.id_video } });
  await video.destroy();

  return res.status(200).json({
    message: "Vidéo supprimée avec succès",
    deletedVideoId: Number(id),
  });
}

async function juryVote(req, res) {
  try {
    const { id } = req.params;
    const { vote, commentary } = req.body;
    const normalizedVote = String(vote || "").trim().toUpperCase();

    if (!["OUI", "NON"].includes(normalizedVote)) {
      return res.status(400).json({ error: "Vote invalide" });
    }

    const video = await Videos.findOne({ where: { id_video: id } });

    if (!video) {
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }

    const requesterId = Number(req.user.id);

    if (video.statusSelection !== "retenue") {
      return res.status(400).json({
        error: "Cette vidéo n'est pas disponible pour le vote jury",
      });
    }

    const sanitizedCommentary = truncateValue(
      typeof commentary === "string" ? commentary.trim() : "",
      255,
    );

    try {
      const [evaluation, created] = await Evaluations.findOrCreate({
        where: {
          id_video: video.id_video,
          id_user: requesterId,
        },
        defaults: {
          note: normalizedVote,
          commentary: sanitizedCommentary || null,
        },
      });

      if (!created) {
        evaluation.note = normalizedVote;
        evaluation.commentary = sanitizedCommentary || null;
        await evaluation.save();
      }
    } catch (writeError) {
      if (writeError?.name === "SequelizeUniqueConstraintError") {
        const existingVote = await Evaluations.findOne({
          where: {
            id_video: video.id_video,
            id_user: requesterId,
          },
        });

        if (existingVote) {
          existingVote.note = normalizedVote;
          existingVote.commentary = sanitizedCommentary || null;
          await existingVote.save();
        } else {
          throw writeError;
        }
      } else {
        throw writeError;
      }
    }

    // New workflow: first jury vote moves the video from phase 1 to phase 2.
    video.statusSelection = "à discuter";
    video.isPriority = false;

    await video.save();
    return res.json(await normalizeVideo(video));
  } catch (error) {
    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Erreur de validation lors du vote jury",
        details: error.errors?.map((item) => item.message).join(" | ") || error.message,
      });
    }

    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Conflit de vote jury",
        details: error.errors?.map((item) => item.message).join(" | ") || error.message,
      });
    }

    return res.status(500).json({
      error: "Erreur interne lors du vote jury",
      details: error?.message,
    });
  }
}

async function getVideoById(req, res) {
  const { id } = req.params;
  const video = await Videos.findOne({ where: { id_video: id } });

  if (!video) {
    return res.status(404).json({ error: "Vidéo non trouvée" });
  }

  const { role } = await getRequester(req);

  const isAdmin = role === "ADMIN";
  const isJury = role === "JURY";
  const isPublic = !role;

  if (isPublic && video.statusSelection !== "finaliste") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  if (
    isJury &&
    !["retenue", "à discuter", "finaliste"].includes(video.statusSelection)
  ) {
    return res.status(403).json({ error: "Accès interdit" });
  }

  if (!isAdmin && !isJury && !isPublic && video.statusSelection !== "finaliste") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  return res.json(await normalizeVideo(video));
}

// Soumission complète d'une vidéo
async function submitVideo(req, res) {
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
    videoFileUrl,
    hasSubtitles,
    thumbnail,
    mediaGallery,
    team,
  } = req.body;

  let resolvedYoutubeMetadata = null;
  if (youtubeLink) {
    try {
      resolvedYoutubeMetadata = await resolveYouTubeVideo(youtubeLink);
    } catch {
      return res.status(400).json({
        error: "Le lien YouTube fourni est invalide ou inaccessible",
      });
    }
  }

  const parsedDuration = Number.parseInt(duration, 10);
  const selectedDuration = Number.isFinite(parsedDuration) && parsedDuration > 0
    ? parsedDuration
    : resolvedYoutubeMetadata?.durationSeconds;

  // Validation des champs obligatoires
  if (
    !title ||
    !selectedDuration ||
    !language ||
    !synopsisOriginal ||
    !classification ||
    (!youtubeLink && !videoFileUrl) ||
    !team
  ) {
    return res.status(400).json({
      error: "Tous les champs obligatoires doivent être remplis",
    });
  }

  // Validation de l'équipe
  if (!Array.isArray(team) || team.length === 0) {
    return res.status(400).json({
      error: "Au moins un membre d'équipe est requis",
    });
  }

  const images = Array.isArray(mediaGallery) ? mediaGallery : [];

  const resolvedYoutubeUrl = resolvedYoutubeMetadata?.canonicalUrl;
  const resolvedThumbnail = resolvedYoutubeMetadata?.thumbnail;

  try {
    const newVideo = await Videos.create({
      title: truncateValue(title),
      traduction: truncateValue(titleEnglish),
      duration: selectedDuration,
      FirstLanguage: truncateValue(language),
      synopsis: truncateValue(synopsisOriginal),
      synopsisEnglish: truncateValue(synopsisEnglish),
      YoutubeLink: truncateValue(videoFileUrl || resolvedYoutubeUrl || youtubeLink),
      subTitles: hasSubtitles ? "yes" : "no",
      toolsAI: truncateValue(techStack, 1000),
      methodology: truncateValue(methodology, 1000),
      teamData: JSON.stringify(team),
      category: truncateValue(classification),
      image1: truncateValue(thumbnail || resolvedThumbnail || images[0]),
      image2: truncateValue(images[1]),
      image3: truncateValue(images[2]),
      statusSelection: "soumis",
      isPriority: false,
      id_user: req.user.id,
    });

    const accountEmail = req.user?.email;
    if (accountEmail) {
      const displayName = [req.user?.name, req.user?.surname].filter(Boolean).join(" ").trim();

      try {
        await mailer.sendMail(
          accountEmail,
          `Confirmation de soumission - ${title}`,
          videoSubmissionConfirmationTemplate(displayName || accountEmail, title),
        );
      } catch (mailError) {
        console.error("Soumission video enregistree mais email de confirmation non envoye:", mailError?.message || mailError);
      }
    }

    return res.status(201).json(await normalizeVideo(newVideo));
  } catch (error) {
    console.error("Erreur lors de la création de la vidéo:", error);

    if (error?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Une vidéo avec ce titre existe déjà. Merci de changer le titre.",
      });
    }

    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Certaines données de la soumission sont invalides.",
      });
    }

    return res.status(500).json({ error: "Erreur lors de la soumission" });
  }
}

export default {
  getVideos,
  getAdminVideos,
  getJuryVideos,
  getPublicVideos,
  getPublicGalleryStatus,
  setPublicGalleryStatus,
  setPhase2Selection,
  setPhase3Award,
  getVideoById,
  createVideo,
  submitVideo,
  uploadVideo,
  resolveYoutube,
  setAdminEligibility,
  deleteAdminVideo,
  juryVote,
};