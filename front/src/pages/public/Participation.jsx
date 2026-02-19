import { Link } from "react-router";
import { useState } from "react";
import "../public/Participation.css";

export default function Participation() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="participation-page">
      <div className="participation-panel-glow" aria-hidden="true"></div>

      <section className="participation-card participation-card-main" aria-labelledby="participation-title">
        <div className="participation-icon-wrap" aria-hidden="true">
          ✦
        </div>

        <h1 id="participation-title" className="participation-title participation-title-neon">
          PARTICIPEZ DÈS MAINTENANT
        </h1>
        <p className="participation-subtitle">ENGAGER VOUS DANS CET ÉVÉNEMENTS</p>

        <div className="participation-card-block">
          <h3>RÉGLEMENT</h3>
          <p>ICI C'EST LE RÉGLEMENT</p>
        </div>

        <div className="participation-cta">
          <label className="participation-checkbox" htmlFor="terms-checkbox">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>J'accepte le règlement général</span>
          </label>

          <Link
            to={agreedToTerms ? "/auth/register" : "#"}
            className={`participation-primary-button participation-btn ${agreedToTerms ? "" : "disabled"}`}
            onClick={(e) => !agreedToTerms && e.preventDefault()}
          >
            S'inscrire maintenant
          </Link>
        </div>
      </section>

      <section className="participation-card participation-login-card" aria-labelledby="already-registered-title">
        <h2 id="already-registered-title" className="participation-login-title">
          Déjà inscrit ?
        </h2>
        <p className="participation-login-text">Connectez-vous à votre compte pour accéder à votre espace personnel</p>
        <Link to="/auth/login" className="participation-primary-button participation-btn">
          Se connecter
        </Link>
      </section>
    </div>
  );
}