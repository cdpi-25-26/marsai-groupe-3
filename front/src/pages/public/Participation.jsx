import { Link } from "react-router";
import { useState } from "react";
import "../public/Participation.css";

export default function Participation() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <>
      <div className="participation-container">
      <div className="participation-content">
        <h1>Participez dès maintenant</h1>
        <p className="participation-subtitle">
          Engager vous dans cet événements
        </p>

        <div className="participation-cards">
          <div className="participation-card">
            <h3>RÉGLEMENT</h3>
            <p>ICI C'EST LE RÉGLEMENT</p>
          </div>
        </div>

        <div className="participation-cta">
          <label className="participation-checkbox">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>J'accepte le règlement général</span>
          </label>
          <Link 
            to={agreedToTerms ? "/auth/register" : "#"}
            className={`participation-btn ${agreedToTerms ? "" : "disabled"}`}
            onClick={(e) => !agreedToTerms && e.preventDefault()}
          >
            S'inscrire maintenant
          </Link>
        </div>
      </div>
    </div>

    <div className="login-card">
      <h2>Déjà inscrit ?</h2>
      <p>Connectez-vous à votre compte pour accéder à votre espace personnel</p>
      <Link to="/auth/login" className="login-card-btn">
        Se connecter
      </Link>
    </div>
    </>
  );
}