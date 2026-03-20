// src/controllers/mailController.js
import mailer from "../config/mailer.js";
import { videoRejectTemplate } from "../templates/videoReject.js";
import { videoAcceptTemplate } from "../templates/videoAccept.js";
import { welcomeTemplate } from "../templates/welcome.js";

const mailController = {

  /**
   * Envoyer un email de rejet de vidéo
   * POST /mail/video/reject
   */
  sendVideoReject: async (req, res) => {
    try {
      const { to, username, videoTitle, reason } = req.body;

      // Validation des champs
      if (!to || !username || !videoTitle || !reason) {
        return res.status(400).json({
          success: false,
          message: "Champs manquants : to, username, videoTitle, reason sont requis",
        });
      }

      const html = videoRejectTemplate(username, videoTitle, reason);

      const response = await mailer.sendMail(
        to,
        `❌ Votre vidéo "${videoTitle}" a été refusée`,
        html
      );

      return res.status(200).json({
        success: true,
        message: "Email de rejet envoyé avec succès",
        data: { response },
      });

    } catch (error) {
      console.error("Erreur sendVideoReject :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'email",
        error: error.message,
      });
    }
  },

  /**
   * Envoyer un email d'acceptation de vidéo
   * POST /mail/video/accept
   */
  sendVideoAccept: async (req, res) => {
    try {
      const { to, username, videoTitle, videoUrl } = req.body;

      if (!to || !username || !videoTitle || !videoUrl) {
        return res.status(400).json({
          success: false,
          message: "Champs manquants : to, username, videoTitle, videoUrl sont requis",
        });
      }

      const html = videoAcceptTemplate(username, videoTitle, videoUrl);

      const response = await mailer.sendMail(
        to,
        `🎉 Votre vidéo "${videoTitle}" a été publiée !`,
        html
      );

      return res.status(200).json({
        success: true,
        message: "Email d'acceptation envoyé avec succès",
        data: { response },
      });

    } catch (error) {
      console.error("Erreur sendVideoAccept :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'email",
        error: error.message,
      });
    }
  },

  /**
   * Envoyer un email de bienvenue
   * POST /mail/welcome
   */
  sendWelcome: async (req, res) => {
    try {
      const { to, username } = req.body;

      if (!to || !username) {
        return res.status(400).json({
          success: false,
          message: "Champs manquants : to, username sont requis",
        });
      }

      const html = welcomeTemplate(username);

      const response = await mailer.sendMail(
        to,
        "👋 Bienvenue sur Mon App !",
        html
      );

      return res.status(200).json({
        success: true,
        message: "Email de bienvenue envoyé avec succès",
        data: { response },
      });

    } catch (error) {
      console.error("Erreur sendWelcome :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'email",
        error: error.message,
      });
    }
  }

};

export default mailController;