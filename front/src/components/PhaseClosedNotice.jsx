import { Link } from "react-router";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./PhaseClosedNotice.css";

export default function PhaseClosedNotice() {
  const { tr } = useLanguage();

  return (
    <div className="phase-closed-notice-wrap">
      <div className="phase-closed-notice-bubble" role="status" aria-live="polite">
        <h2>{tr("Phase terminée", "Phase closed")}</h2>
        <p>
          {tr(
            "Cette page n'est plus accessible suite à la fin de la phase 3.",
            "This page is no longer available because phase 3 has ended.",
          )}
        </p>
        <Link to="/" className="phase-closed-notice-link">
          {tr("Retour à l'accueil", "Back home")}
        </Link>
      </div>
    </div>
  );
}
