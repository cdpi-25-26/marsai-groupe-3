import { Link } from "react-router";
import { useState } from "react";
import "../public/Participation.css";

export default function Participation() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const isConnected = Boolean(localStorage.getItem("token") || localStorage.getItem("username"));
  const destination = isConnected ? "/submit-video" : "/auth/register?next=%2Fsubmit-video";

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
            to={agreedToTerms ? destination : "#"}
            className={`participation-primary-button participation-btn ${agreedToTerms ? "" : "disabled"}`}
            onClick={(e) => !agreedToTerms && e.preventDefault()}
          >
            Déposer un film
          </Link>
        </div>
      </section>
    </div>
  );
}