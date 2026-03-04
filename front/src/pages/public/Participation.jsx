import { Link } from "react-router";
import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "../public/Participation.css";

export default function Participation() {
  const { tr } = useLanguage();
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
          {tr("PARTICIPEZ DÈS MAINTENANT", "JOIN NOW")}
        </h1>
        <p className="participation-subtitle">{tr("ENGAGER VOUS DANS CET ÉVÉNEMENTS", "TAKE PART IN THIS EVENT")}</p>

        <div className="participation-card-block">
          <h3>{tr("RÉGLEMENT", "RULEBOOK")}</h3>
          <p>{tr("ICI C'EST LE RÉGLEMENT", "HERE IS THE RULEBOOK")}</p>
        </div>

        <div className="participation-cta">
          <label className="participation-checkbox" htmlFor="terms-checkbox">
            <input
              id="terms-checkbox"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>{tr("J'accepte le règlement général", "I accept the general rules")}</span>
          </label>

          <Link
            to={agreedToTerms ? destination : "#"}
            className={`participation-primary-button participation-btn ${agreedToTerms ? "" : "disabled"}`}
            onClick={(e) => !agreedToTerms && e.preventDefault()}
          >
            {tr("Déposer un film", "Submit a film")}
          </Link>
        </div>
      </section>
    </div>
  );
}