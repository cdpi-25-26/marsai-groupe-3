import { Link } from "react-router";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { useAuthSession } from "../utils/authSession.js";

export function RoleGuard({ allowedRoles, children, deniedTitle, deniedMessage }) {
  const { tr } = useLanguage();
  const { role: userRole, tempAdminAccess } = useAuthSession();

  const canUseTempAccess =
    tempAdminAccess && allowedRoles.length === 1 && allowedRoles[0] === "ADMIN";

  if (allowedRoles.includes(userRole) || canUseTempAccess) {
    return children;
  } else {
    const defaultTitle = tr("Accès refusé", "Access denied");
    const defaultMessage = `${tr("Cette page nécessite un rôle autorisé", "This page requires an authorized role")} (${allowedRoles.join(" / ")}).`;

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "radial-gradient(120% 100% at 50% 0%, rgba(86, 42, 255, 0.24), rgba(6, 10, 25, 0) 56%), linear-gradient(to bottom, #0b1020, #050814)",
          color: "#f8fafc",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "min(100%, 520px)",
            border: "1px solid rgba(246, 51, 154, 0.42)",
            borderRadius: "22px",
            background: "rgba(15, 23, 42, 0.8)",
            boxShadow: "0 20px 55px rgba(0, 0, 0, 0.45)",
            padding: "1.15rem",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#f6339a" }}>{deniedTitle || defaultTitle}</h2>
          <p style={{ marginTop: 0, color: "#cbd5e1" }}>
            {deniedMessage || defaultMessage}
          </p>
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <Link to="/auth/login" style={{ color: "#93c5fd" }}>
              {tr("Se connecter", "Sign in")}
            </Link>
            <Link to="/" style={{ color: "#93c5fd" }}>
              {tr("Retour accueil", "Back home")}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
