import { NavLink } from "react-router";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { tr } = useLanguage();
  return (
    <div className="admin-layout-page">
      <Navbar />

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <p className="admin-brand-label">{tr("Administration", "Administration")}</p>
            <h1>{tr("Atelier Dashboard", "Workshop Dashboard")}</h1>
          </div>

          <nav className="admin-nav" aria-label={tr("Navigation administration", "Administration navigation")}>
            <NavLink to="/admin" end className="admin-nav-item">
              {tr("Vue d'ensemble", "Overview")}
            </NavLink>

            <NavLink to="/admin/gallery" className="admin-nav-item">
              {tr("Gallery Admin", "Admin Gallery")}
            </NavLink>

            <a href="/admin#users" className="admin-nav-item">
              {tr("Utilisateurs", "Users")}
            </a>

            <a href="/admin#videos" className="admin-nav-item">
              {tr("Vidéos", "Videos")}
            </a>

            <a
              href="/admin#future-sections"
              className="admin-nav-item admin-nav-item-muted"
            >
              {tr("Sections à venir", "Coming sections")}
            </a>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
