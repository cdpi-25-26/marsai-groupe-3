import { Link } from "react-router";
import { useState } from "react";
import decoIcon from "../assets/deco.svg";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              DASHBOARD ADMIN
            </Link>
          )}

          {(isAdmin || isJury) && (
            <Link
              to="/juryGallery"
              className="navbar-btn"
              onClick={closeMenu}
            >
              GALERIE JURY
            </Link>
          )}

          <Link 
            to={participationDestination}
            className="navbar-btn"
            onClick={closeMenu}
          >
            PARTICIPER
          </Link>

          {isConnected && (
            <button
              type="button"
              className="navbar-logout-btn"
              onClick={handleLogout}
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <img src={decoIcon} alt="" className="navbar-logout-icon" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
