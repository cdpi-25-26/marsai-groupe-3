import { Link } from "react-router";
import { useState } from "react";
import decoIcon from "../assets/deco.svg";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const userRole = localStorage.getItem("role");
  const isConnected = Boolean(localStorage.getItem("token") || localStorage.getItem("username"));
  const isAdmin = userRole === "ADMIN";
  const isJury = userRole === "JURY";
  const participationDestination = isConnected ? "/submit-video" : "/participation";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("tempAdminAccess");
    window.location.href = "/auth/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-mars">MARS</span>
          <span className="logo-ai">AI</span>
        </Link>

        {/* Menu burger */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={`burger ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`burger ${isMenuOpen ? "open" : ""}`}></span>
          <span className={`burger ${isMenuOpen ? "open" : ""}`}></span>
        </div>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          {isAdmin && (
            <Link
              to="/admin"
              className="navbar-btn"
              onClick={closeMenu}
            >
              {t("navbar.adminDashboard", "DASHBOARD ADMIN")}
            </Link>
          )}

          {(isAdmin || isJury) && (
            <Link
              to="/juryGallery"
              className="navbar-btn"
              onClick={closeMenu}
            >
              {t("navbar.juryGallery", "GALERIE JURY")}
            </Link>
          )}

          <Link 
            to={participationDestination}
            className="navbar-btn"
            onClick={closeMenu}
          >
            {t("navbar.participate", "PARTICIPER")}
          </Link>

          <button
            type="button"
            className="navbar-language-btn"
            onClick={toggleLanguage}
            aria-label={t("navbar.switchLanguage", "Switch language")}
            title={t("navbar.switchLanguage", "Switch language")}
          >
            {language.toUpperCase()}
          </button>

          {isConnected && (
            <button
              type="button"
              className="navbar-logout-btn"
              onClick={handleLogout}
              aria-label={t("navbar.logout", "Se déconnecter")}
              title={t("navbar.logout", "Se déconnecter")}
            >
              <img src={decoIcon} alt="" className="navbar-logout-icon" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
