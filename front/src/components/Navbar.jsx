import { Link } from "react-router";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
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
          <Link
            to="/programme"
            className="navbar-btn"
            onClick={closeMenu}
          >
            PROGRAMME
          </Link>
          <Link 
            to="/gallery"
            className="navbar-btn"
            onClick={closeMenu}
          >
            GALERIE
          </Link>
          <Link 
            to="/participation"
            className="navbar-btn"
            onClick={closeMenu}
          >
            PARTICIPER
          </Link>
          <Link 
            to="/submit-video"
            className="navbar-btn"
            onClick={closeMenu}
          >
            DÉPOSER UN FILM
          </Link>
        </div>
      </div>
    </nav>
  );
}
