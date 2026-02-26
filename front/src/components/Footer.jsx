import { Link } from "react-router";
import "./Footer.css";
import facebookIcon from "../assets/icones/icones_footer/facebook.svg";
import instaIcon from "../assets/icones/icones_footer/insta.svg";
import xIcon from "../assets/icones/icones_footer/x.svg";
import youtubeIcon from "../assets/icones/icones_footer/youtube.svg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-col brand">
        <div className="logo-mark">
          <span className="logo-text mars">MARS</span>{" "}
          <span className="logo-text ai">AI</span>
        </div>
        <p className="tagline">
          "La plateforme mondiale de la narration générative, ancrée dans la lumière de Marseille."
        </p>
        <div className="social-row">
          <a aria-label="Facebook" className="icon-btn" href="#">
            <img src={facebookIcon} alt="" />
          </a>
          <a aria-label="Instagram" className="icon-btn" href="#">
            <img src={instaIcon} alt="" />
          </a>
          <a aria-label="X" className="icon-btn" href="#">
            <img src={xIcon} alt="" />
          </a>
          <a aria-label="YouTube" className="icon-btn" href="#">
            <img src={youtubeIcon} alt="" />
          </a>
        </div>
      </div>

      <div className="footer-col nav">
        <h4 className="col-title violet">NAVIGATION</h4>
        <Link to="/gallery" className="footer-link">Galerie</Link>
        <Link to="/programme" className="footer-link">Programme</Link>
        <a href="#" className="footer-link">Top 50</a>
        <a href="#" className="footer-link">Billetterie</a>
      </div>

      <div className="footer-col legal">
        <h4 className="col-title pink">LEGAL</h4>
        <a href="#" className="footer-link">Partenaires</a>
        <a href="#" className="footer-link">FAQ</a>
        <a href="#" className="footer-link">Contact</a>
      </div>

      <div className="footer-col newsletter">
        <h4 className="col-title big">RESTEZ CONNECTÉ</h4>
        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Votre email"
            className="newsletter-input"
          />
          <button className="newsletter-btn">OK</button>
        </div>
      </div>
    </footer>
  );
}
