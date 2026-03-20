import { useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { subscribeToNewsletter } from "../api/newsletter.js";
import "./Footer.css";
import facebookIcon from "../assets/icones/icones_footer/facebook.svg";
import instaIcon from "../assets/icones/icones_footer/insta.svg";
import xIcon from "../assets/icones/icones_footer/x.svg";
import youtubeIcon from "../assets/icones/icones_footer/youtube.svg";

export default function Footer() {
  const { tr } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [newsletterError, setNewsletterError] = useState(false);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setNewsletterError(true);
      setNewsletterMessage(
        tr("Veuillez renseigner un email valide.", "Please provide a valid email."),
      );
      return;
    }

    setIsSubmitting(true);
    setNewsletterError(false);
    setNewsletterMessage("");

    try {
      await subscribeToNewsletter(trimmedEmail);
      setNewsletterError(false);
      setNewsletterMessage(
        tr("Inscription newsletter confirmée !", "Newsletter subscription confirmed!"),
      );
      setEmail("");
    } catch (error) {
      const apiMessage = error?.response?.data?.error;
      setNewsletterError(true);
      setNewsletterMessage(
        apiMessage || tr(
          "Impossible de vous inscrire pour le moment.",
          "Unable to subscribe right now.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-col brand">
        <div className="logo-mark">
          <span className="logo-text mars">MARS</span>{" "}
          <span className="logo-text ai">AI</span>
        </div>
        <p className="tagline">
          {tr(
            "La plateforme mondiale de la narration générative, ancrée dans la lumière de Marseille.",
            "The global platform for generative storytelling, rooted in the light of Marseille."
          )}
        </p>
        <div className="social-row">
          <a aria-label={tr("Facebook", "Facebook")} className="icon-btn" href="#">
            <img src={facebookIcon} alt="" />
          </a>
          <a aria-label={tr("Instagram", "Instagram")} className="icon-btn" href="#">
            <img src={instaIcon} alt="" />
          </a>
          <a aria-label={tr("X", "X")} className="icon-btn" href="#">
            <img src={xIcon} alt="" />
          </a>
          <a aria-label={tr("YouTube", "YouTube")} className="icon-btn" href="#">
            <img src={youtubeIcon} alt="" />
          </a>
        </div>
      </div>

      <div className="footer-col nav">
        <h4 className="col-title violet">{tr("NAVIGATION", "NAVIGATION")}</h4>
        <Link to="/gallery" className="footer-link">{tr("Galerie", "Gallery")}</Link>
        <Link to="/programme" className="footer-link">{tr("Programme", "Program")}</Link>
        <a href="#" className="footer-link">{tr("Top 50", "Top 50")}</a>
        <a href="#" className="footer-link">{tr("Billetterie", "Tickets")}</a>
      </div>

      <div className="footer-col legal">
        <h4 className="col-title pink">{tr("LEGAL", "LEGAL")}</h4>
        <a href="#" className="footer-link">{tr("Partenaires", "Partners")}</a>
        <a href="#" className="footer-link">{tr("FAQ", "FAQ")}</a>
        <a href="#" className="footer-link">{tr("Contact", "Contact")}</a>
      </div>

      <div className="footer-col newsletter">
        <h4 className="col-title big">{tr("RESTEZ CONNECTÉ", "STAY CONNECTED")}</h4>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={tr("Votre email", "Your email")}
            className="newsletter-input"
            disabled={isSubmitting}
            required
          />
          <button className="newsletter-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? tr("...", "...") : tr("OK", "OK")}
          </button>
        </form>
        {newsletterMessage && (
          <p className={newsletterError ? "newsletter-feedback error" : "newsletter-feedback success"}>
            {newsletterMessage}
          </p>
        )}
      </div>
    </footer>
  );
}
