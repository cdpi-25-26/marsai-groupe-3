import { Link } from "react-router";
import { useLanguage } from "../i18n/LanguageContext.jsx";

export function RoleGuard({ allowedRoles, children }) {
  const { tr } = useLanguage();
  const userRole = localStorage.getItem("role");
  const tempAdminAccess = localStorage.getItem("tempAdminAccess") === "true";

  const canUseTempAccess =
    tempAdminAccess && allowedRoles.length === 1 && allowedRoles[0] === "ADMIN";

  if (allowedRoles.includes(userRole) || canUseTempAccess) {
    return children;
  } else {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(to bottom, #0b1020, #050814)",
          color: "#f8fafc",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "min(100%, 520px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "14px",
            background: "rgba(15,23,42,0.72)",
            padding: "1rem",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>{tr("Accès refusé", "Access denied")}</h2>
          <p style={{ marginTop: 0, color: "#cbd5e1" }}>
            {tr("Cette page nécessite un rôle autorisé", "This page requires an authorized role")} ({allowedRoles.join(" / ")}).
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
